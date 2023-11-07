#CSV Data Analytics with LangChain Agent and GPT4

import os
import pandas as pd

os.environ["OPENAI_API_KEY"] = "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"

#Dataset Source - https://www.kaggle.com/datasets/unsdsn/world-happiness?select=2019.csv
#world Happiness Report

filepath = "/home/swa/Desktop/LangChain/webbie/2019.csv"
df = pd.read_csv(filepath)
print(df.head())
print(df.shape)
print(df.columns)

#Activate Langchain Agent
from langchain_experimental.agents.agent_toolkits.csv.base import create_csv_agent
from langchain.llms import OpenAI

agent = create_csv_agent(OpenAI(temperature=0),
                         filepath,
                         verbose=True)
#Launch the Agent
agent                         

agent.agent.llm_chain.prompt.template

#Ask Questions to the Agent
agent.run("how many rows and columns are there in the dataframe?")

agent.run("What do you know about the dataset going by the column names?")

agent.run("Can you give me the correlation matrix among 'Score', 'GDP per capita', 'Freedom to make life choices', 'Generosity', 'Perceptions of corruption'?")

agent.run("What conclusion can you make seeing the result of the above correlation matrix")

agent.run("Are There Missing Data in the dataframe?")

agent.run("What are the unique regions in the dataframe?")

agent.run("Plot a barplot showing the top 10 regions by their 'score', with the 'regions' along the x-axis and their 'score' along the y axis.")

agent.run("A horizontal bar plot showing the ratio of the factors affecting the Happiness Score according to the regions, including only the top 10 regions by their happiness score.")