from fastapi import FastAPI, HTTPException, Depends
from dotenv import load_dotenv
from langchain.document_loaders import DirectoryLoader, PyMuPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
import os
from langchain.prompts import PromptTemplate
import psycopg2
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load environment variables from .env file
load_dotenv()

context = """
Context: Addressing a PoSH-related concern in a multinational corporate environment.

Example:
Consider a Scenario, An employee reports feeling uncomfortable due to persistent inappropriate comments from a colleague in the workplace.

Core Question: What are the recommended steps for an employee and the HR department in handling this situation in line with best PoSH practices? 

Factors to consider while answering the question within 200 words be simple but cohesive,

Critical Factors: Consider organizational PoSH policy, cultural sensitivities, and legal implications. 
Response Characteristics: Comprehensive, nuanced, supportive, and non-judgmental. 
Restrictions: Avoid direct legal advice. 
Sensitivity Note: Respectful response with emotional impact consideration. 
Actionable Advice: Outline practical steps and reporting protocols. 
Supplementary Information: Relevant resources, training modules, or support services.

"""

prompt_template = """ 

Hey !! I am BetterAsk, an AI tool that can give you answers about PoSH ( Prevention of Sexual Harassment to workplace)

The following is a friendly conversation between a human and an AI. 

{context}

Question: {question}
Answer:
"""
PROMPT = PromptTemplate(
    template=prompt_template, input_variables=["context", "question"]
)

# Retrieve the OpenAI API key from the environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

DB_USER = os.getenv("POSTGRES_USER")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DB_HOST = os.getenv("POSTGRES_HOST")
DB_PORT = os.getenv("POSTGRES_PORT")
DB_DB = os.getenv("POSTGRES_DB")

# PostgreSQL connection settings
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DB}"

print(DATABASE_URL)

# Create a connection to the DBQL database
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

def get_or_create_user_id(session_id):

    # Check if the user exists in the 'users' table
    check_user_query = "SELECT id FROM users WHERE session_id = %s;"
    cursor.execute(check_user_query, (session_id,))
    user_result = cursor.fetchone()

    # If the user doesn't exist, create a new user
    if user_result is None:
        create_user_query = "INSERT INTO users (session_id) VALUES (%s) RETURNING id;"
        cursor.execute(create_user_query, (session_id,))
        user_id = cursor.fetchone()[0]
        conn.commit()
    else:
        user_id = user_result[0]

    return user_id

def get_pdf_docs(pdf_files):

    loader = DirectoryLoader(pdf_files, glob="**/*.pdf",
                             loader_cls=PyMuPDFLoader)

    return loader

def get_text_chunks(loader: DirectoryLoader):

    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=100,
        length_function=len
    )

    docs = loader.load_and_split(text_splitter)
    return docs

def get_vectorstore(docs):
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_documents(documents=docs, embedding=embeddings)
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
        memory=memory,
        combine_docs_chain_kwargs={'prompt': PROMPT}
    )

    return conversation_chain

@app.post("/process-documents")
async def process_documents():
    
    # Code to process the documents
    raw_text = get_pdf_docs(os.listdir('posh-docs'))
    text_chunks = get_text_chunks(raw_text)
    vectorstore = get_vectorstore(text_chunks)

    # Set the global_chat_session.conversation after processing documents
    global_chat_session.conversation = get_conversation_chain(vectorstore)

    return {"message": "Documents processed. Start asking questions using /chat/<query>"}

class UserSession(BaseModel):
    session_id: str

@app.post("/get-conversation-history")
async def get_user_conversation_history(session: UserSession, _ : psycopg2.extensions.cursor = Depends(get_db_cursor)):

    session_id = session.session_id

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

class ChatRequest(BaseModel):
    query: str
    session_id: str

@app.post("/chat")
async def chat(request: ChatRequest, conversation_id: int = None, _ : ChatSession = Depends(get_chat_session)):

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

class ClearChatRequest(BaseModel):
    session_id: str

@app.post("/clear-chat")
async def clear_chat(request: ClearChatRequest, db: psycopg2.extensions.cursor = Depends(get_db_cursor)):
    
    session_id = request.session_id

    new_session_id = "D-" + session_id + "-D"

    # Clear the conversation history for the specified user
    clear_query = "UPDATE users SET session_id = %s WHERE session_id = %s;"
    db.execute(clear_query, (new_session_id, session_id,))
    conn.commit()

    return {"message": "Conversation history cleared successfully."}

class UserFeedback(BaseModel):
    session_id: str
    user_feedback: str

@app.post("/feedback")
async def submit_user_feedback(feedback: UserFeedback, db: psycopg2.extensions.cursor = Depends(get_db_cursor)):
    user_id = get_or_create_user_id(feedback.session_id)

    # Insert user feedback into the database
    insert_query = "INSERT INTO user_feedback (user_id, feedback_id, user_feedback) VALUES (%s, DEFAULT, %s) RETURNING id;"
    db.execute(insert_query, (user_id, feedback.user_feedback))
    feedback_id = db.fetchone()[0]
    conn.commit()

    return {"message": "User feedback submitted successfully.", "feedback_id": feedback_id}

class UserResponseFeedback(BaseModel):
    session_id: str
    conversation_id: int
    like_dislike: bool
    response_feedback: str

@app.post("/response-feedback")
async def submit_user_response_feedback(response_feedback: UserResponseFeedback, db: psycopg2.extensions.cursor = Depends(get_db_cursor)):
    user_id = get_or_create_user_id(response_feedback.session_id)

    # Insert user response feedback into the database
    insert_query = "INSERT INTO user_response_feedback (user_id, conversation_id, response_feedback_id, like_dislike, response_feedback) VALUES (%s, %s, DEFAULT, %s, %s) RETURNING id;"
    db.execute(insert_query, (user_id, response_feedback.conversation_id, response_feedback.like_dislike, response_feedback.response_feedback))
    response_feedback_id = db.fetchone()[0]
    conn.commit()

    return {"message": "User response feedback submitted successfully.", "response_feedback_id": response_feedback_id}

if __name__ == "__main__":
    async def startup():
        print("Starting up...")
        await process_documents()

    app.add_event_handler("startup", startup)
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)