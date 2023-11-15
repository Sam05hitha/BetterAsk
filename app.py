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

class ChatSession:
    def __init__(self):
        self.conversation = None
        self.chat_history = []

# A global chat session.
# Replace with a suitable data structure (like a dict) for multiple sessions
global_chat_session = ChatSession()

async def get_conversation(query):
    if global_chat_session.conversation is None:
        raise HTTPException(status_code=400, detail="No documents processed yet")
    return global_chat_session.conversation({'question': query})

def get_chat_session():
    return ChatSession()

# Dependency to get the database cursor
async def get_db_cursor():
    db = psycopg2.connect(DATABASE_URL, sslmode='require')
    cursor = db.cursor()
    try:
        yield cursor
    finally:
        cursor.close()
        db.close()

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

    print(conversation_chain)

    return conversation_chain

@app.get("/get-conversation-history/{conversation_id}")
async def get_conversation_history(conversation_id: int, db: psycopg2.extensions.cursor = Depends(get_db_cursor)):
    # Retrieve the conversation history from the database
    
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
async def chat(query: str, conversation_id: int = None, chat_session: ChatSession = Depends(get_chat_session)):
    if conversation_id is None:
        # If conversation_id is not provided, generate a new one
        insert_query = "INSERT INTO conversation_history (user_query, assistant_response) VALUES (%s, %s) RETURNING id;"
        cursor.execute(insert_query, (query, ""))
        conversation_id = cursor.fetchone()[0]
        conn.commit()

    # Retrieve the conversation history from the database
    select_query = "SELECT user_query, assistant_response FROM conversation_history WHERE id = %s;"
    cursor.execute(select_query, (conversation_id,))
    history = cursor.fetchall()

    # Reconstruct the conversation chain
    conversation_chain = []
    for row in history:
        conversation_chain.append({"role": "user", "content": row[0]})
        conversation_chain.append({"role": "assistant", "content": row[1]})

    # Call the get_conversation method of the chat session
    response = await get_conversation(query)

    # Insert the new response into the database
    update_query = "UPDATE conversation_history SET assistant_response = %s WHERE id = %s;"
    cursor.execute(update_query, (response["answer"], conversation_id))
    conn.commit()

    return {"answer": response["answer"], "conversation_id": conversation_id}

@app.post("/process-documents")
async def process_documents(pdf_files: List[UploadFile] = File(...)):

    # Code to process the documents
    raw_text = get_pdf_text(pdf_files)
    text_chunks = get_text_chunks(raw_text)
    vectorstore = get_vectorstore(text_chunks)

    # Set the global_chat_session.conversation after processing documents
    global_chat_session.conversation = get_conversation_chain(vectorstore)

    return {"message": "Documents processed. Start asking questions using /chat/<query>"}

if __name__ == "__main__":
    import uvicorn
    # Run the FastAPI application using Uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)