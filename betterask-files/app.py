from fastapi import FastAPI, UploadFile, HTTPException, File
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from typing import List

app = FastAPI()

class ChatSession:
    def __init__(self):
        self.conversation = None
        self.chat_history = []

# A global chat session.
# Replace with a suitable data structure (like a dict) for multiple sessions
global_chat_session = ChatSession()

def get_pdf_text(pdf_files: List[UploadFile]):
    text = ""
    for pdf_file in pdf_files:
        pdf_reader = PdfReader(pdf_file.file)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

def get_text_chunks(raw_text):
    # Code to split the text into chunks goes here
    pass

def get_vectorstore(text_chunks):
    # Code to get the vectorstore goes here
    pass

def get_conversation_chain(vectorstore):
    # Code to get the conversation chain goes here
    pass

@app.post("/chat/{query}")
async def chat(query: str):
    if global_chat_session.conversation is None:
        raise HTTPException(status_code=400, detail="No documents processed yet")

    response = global_chat_session.conversation({'question': query})
    global_chat_session.chat_history.append({"role": "user", "content": query})
    global_chat_session.chat_history.append({"role": "assistant", "content": response["answer"]})
    return {"answer": response["answer"] }

@app.post("/process-documents")
async def process_documents(pdf_files: List[UploadFile] = File(...)):
    raw_text = get_pdf_text(pdf_files)
    text_chunks = get_text_chunks(raw_text)
    vectorstore = get_vectorstore(text_chunks)
    global_chat_session.conversation = get_conversation_chain(vectorstore)
    return {"message": "Documents processed. Start asking questions using /chat/<query>"}