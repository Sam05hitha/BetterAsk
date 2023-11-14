from fastapi import FastAPI, UploadFile, HTTPException, File, Depends
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.embeddings import HuggingFaceInstructEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
import components.authenticate as authenticate
from typing import List  # Import List
import io
import os
import psycopg2
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

# Load environment variables from .env file
load_dotenv()

# Retrieve the OpenAI API key from the environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# PostgreSQL connection settings
DATABASE_URL = os.getenv("DATABASE_URL")

# Create a connection to the PostgreSQL database
conn = psycopg2.connect(DATABASE_URL, sslmode='require')

# Create a cursor object to interact with the database
cursor = conn.cursor()

# FastAPI application
app = FastAPI()

# Enable CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Dependency to get the database cursor
async def get_db_cursor():
    db = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = db.cursor()
    try:
        yield cursor
    finally:
        cursor.close()
        db.close()

class ChatSession:
    def __init__(self):
        self.conversation = None
        self.chat_history = []

# A global chat session.
# Replace with a suitable data structure (like a dict) for multiple sessions
global_chat_session = ChatSession()

def get_pdf_text(pdf_files: UploadFile):
    # Code to read text from PDF
    text = ""
    for pdf_file in pdf_files:
        pdf_bytes = io.BytesIO(pdf_file.file.read())
        pdf_reader = PdfReader(pdf_bytes)
        for page in pdf_reader.pages:
            text += page.extract_text()

    return text

def get_text_chunks(raw_text):
    # Code to split the text into chunks
    text_splitter = CharacterTextSplitter(
        separator="\n", chunk_size=1000, chunk_overlap=200, length_function=len
    )
    chunks = text_splitter.split_text(raw_text)
    return chunks

def get_vectorstore(text_chunks):
    # Code to get the vectorstore
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore

def get_conversation_chain(vectorstore):
    # Code to get the conversation chain
    llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY)
    memory = ConversationBufferMemory(
        memory_key='chat_history',
        return_messages=True
    )

    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory
    )

    return conversation_chain

@app.get("/get-conversation-chain/{conversation_id}")
async def get_conversation_chain(conversation_id: int, db: psycopg2.extensions.cursor = Depends(get_db_cursor)):
    # Retrieve the conversation history from the database

    if global_chat_session.conversation is None:
        raise HTTPException(status_code=400, detail="No documents processed yet")

    select_query = "SELECT user_query, assistant_response FROM conversation_history WHERE id = %s;"
    cursor.execute(select_query, (conversation_id,))
    history = cursor.fetchall()

    # Reconstruct the conversation chain
    conversation_chain = []
    for row in history:
        conversation_chain.append({"role": "user", "content": row[0]})
        conversation_chain.append({"role": "assistant", "content": row[1]})

    return {"conversation_chain": conversation_chain}

@app.post("/chat/{query}")
async def chat(query: str, conversation_id: int = None, db: psycopg2.extensions.cursor = Depends(get_db_cursor)):
    if global_chat_session.conversation is None:
        raise HTTPException(status_code=400, detail="No documents processed yet")
    response = global_chat_session.conversation({'question': query})
    global_chat_session.chat_history.append({"role": "user", "content": query})
    global_chat_session.chat_history.append({"role": "assistant", "content": response["answer"]})

    # Insert the conversation into the database
    insert_query = "INSERT INTO conversation_history (user_query, assistant_response) VALUES (%s, %s) RETURNING id;"
    cursor.execute(insert_query, (query, response["answer"]))
    conversation_id = cursor.fetchone()[0]
    conn.commit()

    if conversation_id is None:
        insert_query = "INSERT INTO conversation_history (user_query, assistant_response) VALUES (%s, %s) RETURNING id;"
        cursor.execute(insert_query, (query, response["answer"]))
        conversation_id = cursor.fetchone()[0]
        conn.commit()


    return {"answer": response["answer"], "conversation_id": conversation_id}

@app.post("/process-documents")
async def process_documents(pdf_files: List[UploadFile] = File(...)):
    raw_text = get_pdf_text(pdf_files)
    text_chunks = get_text_chunks(raw_text)
    vectorstore = get_vectorstore(text_chunks)
    global_chat_session.conversation = get_conversation_chain(vectorstore)

    return {"message": "Documents processed. Start asking questions using /chat/<query>"}

if __name__ == "__main__":
    import uvicorn
    # Run the FastAPI application using Uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)