import os
import io
from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from langchain_experimental.agents.agent_toolkits.csv.base import create_csv_agent
from langchain.llms import OpenAI

app = FastAPI()

load_dotenv(find_dotenv())
OpenAI.api_key = os.environ['OPENAI_API_KEY']

if not OpenAI.api_key:
    print("Error: OPENAI_API_KEY is not set.")
    exit(1)
else:
    print("OPENAI_API_KEY is set.")    


@app.post("/ask_csv")
async def ask_csv(file: UploadFile = File(...), question: str = Form(...)):
    try:
        contents = await file.read()
        agent = create_csv_agent(OpenAI(temperature=0), io.StringIO(contents.decode("utf-8")), verbose=True)
        result = agent.run(question)
        return JSONResponse(content={"answer": result}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error":f"Error processing the file: {str(e)}"}, status_code=500)    
    