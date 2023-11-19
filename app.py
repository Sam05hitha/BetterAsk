from fastapi import FastAPI, HTTPException, Depends
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
import os
import psycopg2
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load environment variables from .env file
load_dotenv()

# Retrieve the OpenAI API key from the environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# PostgreSQL connection settings
DATABASE_URL = os.getenv("DATABASE_URL")

# Create a connection to the PostgreSQL database
conn = psycopg2.connect(DATABASE_URL, sslmode='prefer')

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
    db = psycopg2.connect(DATABASE_URL, sslmode='prefer')
    cursor = db.cursor()
    try:
        yield cursor
    finally:
        cursor.close()
        db.close()

@app.get("/get-conversation-history/{session_id}")
async def get_user_conversation_history(session_id: str, db: psycopg2.extensions.cursor = Depends(get_db_cursor)):

    user_id = get_or_create_user_id(session_id)

    # Retrieve the conversation history for a specific user from the database
    select_query = "SELECT user_query, assistant_response, user_id, timestamp, id FROM user_conversation_history WHERE user_id = %s;"
    cursor.execute(select_query, (user_id,))
    history = cursor.fetchall()

    # Reconstruct the conversation chain
    conversation_chain = []
    for row in history:
        conversation_chain.append({"query": row[0], "answer": row[1], "user_id": row[2],  "timestamp": row[3], "converstaion_id": row[4]})

    return {"conversation_chain": conversation_chain}

def get_or_create_user_id(session_id):

    # Check if the user exists in the 'users' table
    check_user_query = "SELECT id FROM users WHERE email = %s;"
    cursor.execute(check_user_query, (session_id,))
    user_result = cursor.fetchone()

    # If the user doesn't exist, create a new user
    if user_result is None:
        create_user_query = "INSERT INTO users (email) VALUES (%s) RETURNING id;"
        cursor.execute(create_user_query, (session_id,))
        user_id = cursor.fetchone()[0]
        conn.commit()
    else:
        user_id = user_result[0]

    return user_id

class ChatRequest(BaseModel):
    query: str
    session_id: str

@app.post("/chat/{query}")
async def chat(request: ChatRequest, conversation_id: int = None, chat_session: ChatSession = Depends(get_chat_session)):

    session_id = request.session_id
    query = request.query

    if session_id is None:
        raise HTTPException(status_code=400, detail="session_id is required")

    user_id = get_or_create_user_id(session_id)

    if conversation_id is None:
        # If conversation_id is not provided, generate a new one
        insert_query = "INSERT INTO user_conversation_history (user_id, user_query, assistant_response) VALUES (%s, %s, %s) RETURNING id;"
        cursor.execute(insert_query, (user_id, query, ""))
        conversation_id = cursor.fetchone()[0]
        conn.commit()

    # Retrieve the conversation history from the database
    select_query = "SELECT user_query, assistant_response FROM user_conversation_history WHERE id = %s;"
    cursor.execute(select_query, (conversation_id,))
    history = cursor.fetchall()

    # Reconstruct the conversation chain
    conversation_chain = []
    for row in history:
        conversation_chain.append({"user_id": user_id, "converstaion_id": conversation_id,"query": row[0], "answer": row[1]})

    # Call the `get_conversation` method of the chat session
    response = await get_conversation(query)

    # Insert the new response into the database
    update_query = "UPDATE user_conversation_history SET assistant_response = %s WHERE id = %s;"
    cursor.execute(update_query, (response["answer"], conversation_id))
    conn.commit()

    return {"answer": response["answer"], "conversation_id": conversation_id, "user_id": user_id}

def get_pdf_text(pdf_files):
    # Code to read text from PDF
    text = ""
    for pdf_file in pdf_files:

        print("Reading file: ", pdf_file)

        with open(os.path.join("posh-docs", pdf_file), "rb") as file:
            pdf_reader = PdfReader(file)
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


@app.post("/process-documents")
async def process_documents():
    
    # Code to process the documents
    raw_text = get_pdf_text(os.listdir('posh-docs'))
    text_chunks = get_text_chunks(raw_text)
    vectorstore = get_vectorstore(text_chunks)

    # Set the global_chat_session.conversation after processing documents
    global_chat_session.conversation = get_conversation_chain(vectorstore)

    return {"message": "Documents processed. Start asking questions using /chat/<query>"}


if __name__ == "__main__":
    import uvicorn
    # Run the FastAPI application using Uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)