import os
import zipfile
from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI, File, UploadFile, Depends
from langchain.document_loaders import DirectoryLoader
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.llms import OpenAI

load_dotenv(find_dotenv())
OpenAI.api_key = os.environ['OPENAI_API_KEY']

if not OpenAI.api_key:
    print("Error: OPENAI_API_KEY is not set.")
    exit(1)
else:
    print("OPENAI_API_KEY is set.")

app = FastAPI()

# Setting up the vector store, retriever, and Turbo LLM
persist_directory = 'db'
embedding = OpenAIEmbeddings()
vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)
retriever = vectordb.as_retriever(search_kwargs={"k": 2})
turbo_llm = ChatOpenAI(temperature=0, model='gpt-3.5-turbo')
qa_chain = RetrievalQA.from_chain_type(llm=turbo_llm, chain_type="stuff", retriever=retriever, return_source_documents=True)

# Dependency to get the dynamic directory path from the endpoint
async def get_directory_path(directory: UploadFile = File(...)):
    # Save the uploaded ZIP file to a known location
    upload_dir_path = f'/path/to/uploaded_directories/{directory.filename}'
    with open(upload_dir_path, 'wb') as f:
        f.write(directory.file.read())
    return upload_dir_path

@app.post("/upload_directory")
async def upload_directory(directory_path: str = Depends(get_directory_path)):
    # Specify the directory and the pattern for all files
    all_files_loader = DirectoryLoader(directory_path, glob="**/*.*")

    # Load documents
    all_files_docs = all_files_loader.load()

    # Process and embed the text
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    all_files_texts = text_splitter.split_documents(all_files_docs)

    embedding = OpenAIEmbeddings()
    all_files_vectordb = Chroma.from_documents(documents=all_files_texts, embedding=embedding, persist_directory=persist_directory)

    # Persist the database
    all_files_vectordb.persist()

    return {"status": "success"}

@app.post("/ask")
async def ask_question(question: str):
    llm_response = qa_chain(question)
    process_llm_response(llm_response)
    return {"answer": llm_response['result']}

# Helper function to process LLM response and print sources
def process_llm_response(llm_response):
    print(llm_response['result'])
    print('\n\nSources:')
    for source in llm_response["source_documents"]:
        print(source.metadata['source'])

if __name__ == "__main__":
    import uvicorn 
    uvicorn.run(app, host='127.0.0.1', port=8000)


'''TheDirectoryLoader. Again, this has a pretty simple interface: it takes only a path to a directory and an optional regex to glob for files against. But under the hood it is looping over all files and using the above UnstructuredFileLoader to load them. This makes it possible to load files of all types in a single call.'''