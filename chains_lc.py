import os
from dotenv import load_dotenv, find_dotenv

from fastapi import FastAPI

from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

app = FastAPI()

load_dotenv(find_dotenv())
OpenAI.api_key = os.environ['OPENAI_API_KEY']

if not OpenAI.api_key:
    print("Error: OPENAI_API_KEY is not set.")
    exit(1)
else:
    print("OPENAI_API_KEY is set.")    

# Initialize OpenAI language model
llm = OpenAI(temperature=0.9)

#Defining a prompt template for the chatbot
prompt = PromptTemplate(
    input_variables=["topic"],
    template="Write a {topic} code snippet and \ngive the output of the code.",
)

# Creating an LLMChain with OpenAI language model and the prompt template
chain = LLMChain(llm=llm, prompt=prompt)

#Defining a route for the chatbot
@app.get("/chatbot/{lang}/{query}")
def get_chatbot_response(lang: str, query: str):
    #Replacing the LangChain prompt variable with the user's query
    prompt_variables = {"topic": query}
    
    langchain_response = chain.run(prompt_variables)

    return {"langchain_response": langchain_response}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

    
