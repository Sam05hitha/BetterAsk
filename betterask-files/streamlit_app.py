from fastapi import FastAPI, UploadFile, HTTPException, File
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

OPENAI_API_KEY = "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"
app = FastAPI()

class ChatSession:
    def __init__(self):
        self.conversation = None
        self.chat_history = []

# A global chat session.
# Replace with a suitable data structure (like a dict) for multiple sessions
global_chat_session = ChatSession()

def get_pdf_text(pdf_file: UploadFile):
    # Code to read text from PDF
    text = ""
    for pdf in pdf_file:
        pdf_reader = PdfReader(pdf)
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

@app.post("/chat/{query}")
async def chat(query: str):
    if global_chat_session.conversation is None:
        raise HTTPException(status_code=400, detail="No documents processed yet")
    response = global_chat_session.conversation({'question': query})
    global_chat_session.chat_history.append({"role": "user", "content": query})
    global_chat_session.chat_history.append({"role": "assistant", "content": response["answer"]})
    return {"answer": response["answer"]}

@app.post("/process-documents")
async def process_documents(pdf_files: List[UploadFile] = File(...)):
    raw_text = get_pdf_text(pdf_files)
    text_chunks = get_text_chunks(raw_text)
    vectorstore = get_vectorstore(text_chunks)
    global_chat_session.conversation = get_conversation_chain(vectorstore)
    return {"message": "Documents processed. Start asking questions using /chat/<query>"}
