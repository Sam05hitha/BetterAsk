import io
import random
import shutil
import string
from zipfile import ZipFile
import streamlit as st
from streamlit_extras.add_vertical_space import add_vertical_space
import pandas as pd
import asyncio
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)
import sketch
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.embeddings import HuggingFaceHubEmbeddings
import requests
from bs4 import BeautifulSoup
import pdfplumber
import docx2txt
from duckduckgo_search import DDGS
from itertools import islice
from os import path
import os
from hugchat import hugchat
from hugchat.login import Login
from langchain.llms.base import LLM
from typing import Optional, List, Mapping, Any
from time import sleep
from datetime import datetime
now = datetime.now()


hf = None
repo_id = "sentence-transformers/all-mpnet-base-v2"
HUGGINGFACE_API_KEY="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"


class HuggingChat(LLM):
    """HuggingChat LLM wrapper."""
    chatbot : Optional[hugchat.ChatBot] = None
    conversation : Optional[str] = ""
    email : Optional[str]
    psw : Optional[str]

    @property
    def _llm_type(self) -> str:
        return "custom"

    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        if stop is not None:
            pass

        if self.chatbot is None:
            if self.email is None and self.psw is None:
                ValueError("Email and Password is required!")
            else: 
                if self.conversation == "":
                    sign = Login(self.email, self.psw)
                    cookies = sign.login()

                    # Create a ChatBot
                    self.chatbot = hugchat.ChatBot(cookies=cookies.get_dict()) 
                
                    id = self.chatbot.new_conversation()
                    self.chatbot.change_conversation(id)
                    self.conversation = id         
                else:
                    self.chatbot.change_conversation(self.conversation) # type: ignore
            
    
        data = self.chatbot.chat(prompt, temperature=0.4, stream=False) # type: ignore
        return data # type: ignore

    @property
    def _identifying_params(self) -> Mapping[str, Any]:
        """Get the identifying parameters."""
        return {"model": "HuggingCHAT"}
    

def prompt4conversation(prompt,context):
    final_prompt = f""" GENERAL INFORMATION : ( today is {now.strftime("%d/%m/%Y %H:%M:%S")}. 
                        ISTRUCTION : IN YOUR ANSWER NEVER INCLUDE THE USER QUESTION or MESSAGE , WRITE ALWAYS ONLY YOUR ACCURATE ANSWER!
                        PREVIUS MESSAGE : ({context})
                        NOW THE USER ASK : {prompt} . 
                        WRITE THE ANSWER :"""
    return final_prompt

def prompt4conversationInternet(prompt,context, internet, resume):
    final_prompt = f""" GENERAL INFORMATION : ( today is {now.strftime("%d/%m/%Y %H:%M:%S")}.
                        ISTRUCTION : IN YOUR ANSWER NEVER INCLUDE THE USER QUESTION or MESSAGE , WRITE ALWAYS ONLY YOUR ACCURATE ANSWER!
                        PREVIUS MESSAGE : ({context})
                        NOW THE USER ASK : {prompt}.
                        INTERNET RESULT TO USE TO ANSWER : ({internet})
                        INTERNET RESUME : ({resume})
                        NOW THE USER ASK : {prompt}.
                        WRITE THE ANSWER BASED ON INTERNET INFORMATION :"""
    return final_prompt

def prompt4Data(prompt, context, solution):
    final_prompt = f"""
                        ISTRUCTION : IN YOUR ANSWER NEVER INCLUDE THE USER QUESTION or MESSAGE , YOU MUST MAKE THE CORRECT ANSWER MORE ARGUMENTED ! IF THE CORRECT ANSWER CONTAINS CODE YOU ARE OBLIGED TO INSERT IT IN YOUR NEW ANSWER!
                        PREVIUS MESSAGE : ({context})
                        NOW THE USER ASK : {prompt}
                        THIS IS THE CORRECT ANSWER : ({solution}) 
                        MAKE THE ANSWER MORE ARGUMENTED, WITHOUT CHANGING ANYTHING OF THE CORRECT ANSWER :"""
    return final_prompt

def prompt4Code(prompt, context, solution):
    final_prompt = f"""
                        ISTRUCTION : IN YOUR ANSWER NEVER INCLUDE THE USER QUESTION or MESSAGE , THE CORRECT ANSWER CONTAINS CODE YOU ARE OBLIGED TO INSERT IT IN YOUR NEW ANSWER!
                        PREVIUS MESSAGE : ({context})
                        NOW THE USER ASK : {prompt}
                        THIS IS THE CODE FOR THE ANSWER : ({solution}) 
                        WITHOUT CHANGING ANYTHING OF THE CODE of CORRECT ANSWER , MAKE THE ANSWER MORE DETALIED INCLUDING THE CORRECT CODE :"""
    return final_prompt


def prompt4Context(prompt, context, solution):
    final_prompt = f"""
                        ISTRUCTION : IN YOUR ANSWER NEVER INCLUDE THE USER QUESTION or MESSAGE ,WRITE ALWAYS ONLY YOUR ACCURATE ANSWER!
                        PREVIUS MESSAGE : ({context})
                        NOW THE USER ASK : {prompt}
                        THIS IS THE CORRECT ANSWER : ({solution}) 
                        WITHOUT CHANGING ANYTHING OF CORRECT ANSWER , MAKE THE ANSWER MORE DETALIED:"""
    return final_prompt

hf_obj = HuggingFaceHubEmbeddings(
    repo_id=repo_id,
    task="feature-extraction",
    huggingfacehub_api_token=HUGGINGFACE_API_KEY,
) # type: ignore

st.set_page_config(
    page_title="WebbieChat App💬", page_icon="🤗", layout="wide", initial_sidebar_state="expanded"
)

st.markdown('<style>.css-w770g5{\
            width: 100%;}\
            .css-b3z5c9{    \
            width: 100%;}\
            .stButton>button{\
            width: 100%;}\
            .stDownloadButton>button{\
            width: 100%;}\
            </style>', unsafe_allow_html=True)

# Sidebar contents for logIN, choose plugin, and export chat
with st.sidebar:
    st.title('🤗💬 WebbieChat App')
    
    if 'hf_email' not in st.session_state or 'hf_pass' not in st.session_state:
        with st.expander("ℹ️ Login", expanded=True):
            st.header('WebbieChat Login')
            hf_email = st.text_input('Enter E-mail:')
            hf_pass = st.text_input('Enter password:', type='password')

            if st.button('Login 🚀') and hf_email and hf_pass: 
                with st.spinner('🚀 Logging in...'):
                    st.session_state['hf_email'] = hf_email
                    st.session_state['hf_pass'] = hf_pass
                    try:
                    
                        sign = Login(st.session_state['hf_email'], st.session_state['hf_pass'])
                        cookies = sign.login()
                        chatbot = hugchat.ChatBot(cookies=cookies.get_dict())
                    except Exception as e:
                        st.error(e)
                        st.info("⚠️ Please check your credentials and try again.")

                        from time import sleep
                        sleep(3)
                        del st.session_state['hf_email']
                        del st.session_state['hf_pass']
                        st.experimental_rerun()

                    st.session_state['chatbot'] = chatbot

                    id = st.session_state['chatbot'].new_conversation()
                    st.session_state['chatbot'].change_conversation(id)

                    st.session_state['conversation'] = id
                    # Generate empty lists for generated and past.
                    ## generated stores AI generated responses
                    if 'generated' not in st.session_state:
                        st.session_state['generated'] = ["I'm BetterAsk, How may I help you ? "]
                    ## past stores User's questions
                    if 'past' not in st.session_state:
                        st.session_state['past'] = ['Hi!']

                    hug_face = HuggingChat(email=st.session_state['hf_email'], psw=st.session_state['hf_pass'])

                    print(hug_face)

                    st.session_state['LLM'] =  hug_face
                    
                    st.experimental_rerun()
                    

    else:
        with st.expander("ℹ️ Advanced Settings"):
            #temperature: Optional[float]. Default is 0.5
            #top_p: Optional[float]. Default is 0.95
            #repetition_penalty: Optional[float]. Default is 1.2
            #top_k: Optional[int]. Default is 50
            #max_new_tokens: Optional[int]. Default is 1024

            temperature = st.slider('🌡 Temperature', min_value=0.1, max_value=1.0, value=0.5, step=0.01)
            top_p = st.slider('💡 Top P', min_value=0.1, max_value=1.0, value=0.95, step=0.01)
            repetition_penalty = st.slider('🖌 Repetition Penalty', min_value=1.0, max_value=2.0, value=1.2, step=0.01)
            top_k = st.slider('❄️ Top K', min_value=1, max_value=100, value=50, step=1)
            max_new_tokens = st.slider('📝 Max New Tokens', min_value=1, max_value=1024, value=1024, step=1)
    

        # FOR DEVELOPMENT NEW PLUGIN YOU MUST ADD IT HERE INTO THE LIST 
        # YOU NEED ADD THE NAME AT 144 LINE

        #plugins for conversation
        plugins = ["🛑 No PLUGIN", "📋 Talk with your DATA", "📝 Talk with your DOCUMENTS" ,"💾 Upload saved VectorStore"]
        if 'plugin' not in st.session_state:
            st.session_state['plugin'] = st.selectbox('🔌 Plugins', plugins, index=0)
        else:
            if st.session_state['plugin'] == "🛑 No PLUGIN":
                st.session_state['plugin'] = st.selectbox('🔌 Plugins', plugins, index=plugins.index(st.session_state['plugin']))

# DATA PLUGIN
        if st.session_state['plugin'] == "📋 Talk with your DATA" and 'df' not in st.session_state:
            with st.expander("📋 Talk with your DATA", expanded= True):
                upload_csv = st.file_uploader("Upload your CSV", type=['csv'])
                if upload_csv is not None:
                    df = pd.read_csv(upload_csv)
                    st.session_state['df'] = df
                    st.experimental_rerun()
        if st.session_state['plugin'] == "📋 Talk with your DATA":
            if st.button('🛑📋 Remove DATA from context'):
                if 'df' in st.session_state:
                    del st.session_state['df']
                del st.session_state['plugin']
                st.experimental_rerun()

# DOCUMENTS PLUGIN
        if st.session_state['plugin'] == "📝 Talk with your DOCUMENTS" and 'documents' not in st.session_state:
            with st.expander("📝 Talk with your DOCUMENT", expanded=True):  
                upload_pdf = st.file_uploader("Upload your DOCUMENT", type=['txt', 'pdf', 'docx'], accept_multiple_files=True)
                if upload_pdf is not None and st.button('📝✅ Load Documents'):
                    documents = []
                    with st.spinner('🔨 Reading documents...'):
                        for upload_pdf in upload_pdf:
                            print(upload_pdf.type)
                            if upload_pdf.type == 'text/plain':
                                documents += [upload_pdf.read().decode()]
                            elif upload_pdf.type == 'application/pdf':
                                with pdfplumber.open(upload_pdf) as pdf:
                                    documents += [page.extract_text() for page in pdf.pages]
                            elif upload_pdf.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                                text = docx2txt.process(upload_pdf)
                                documents += [text]
                    st.session_state['documents'] = documents
                    # Split documents into chunks
                    with st.spinner('🔨 Creating vectorstore...'):
                        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
                        texts = text_splitter.create_documents(documents)
                        # Select embeddings
                        embeddings = hf_obj
                        # Create a vectorstore from documents
                        random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
                        db = Chroma.from_documents(texts, embeddings, persist_directory="./chroma_db_" + random_str)

                    with st.spinner('🔨 Saving vectorstore...'):
                        # save vectorstore
                        db.persist()
                        #create .zip file of directory to download
                        shutil.make_archive("./chroma_db_" + random_str, 'zip', "./chroma_db_" + random_str)
                        # save in session state and download
                        st.session_state['db'] = "./chroma_db_" + random_str + ".zip" 
                    
                    with st.spinner('🔨 Creating QA chain...'):
                        # Create retriever interface
                        retriever = db.as_retriever()
                        # Create QA chain
                        qa = RetrievalQA.from_chain_type(llm=st.session_state['LLM'], chain_type='stuff', retriever=retriever,  return_source_documents=True)
                        st.session_state['pdf'] = qa

                    st.experimental_rerun()

        if st.session_state['plugin'] == "📝 Talk with your DOCUMENTS":
            if 'db' in st.session_state:
                # leave ./ from name for download
                file_name = st.session_state['db'][2:]
                st.download_button(
                    label="📩 Download vectorstore",
                    data=open(file_name, 'rb').read(),
                    file_name=file_name,
                    mime='application/zip'
                )
            if st.button('🛑📝 Remove PDF from context'):
                if 'pdf' in st.session_state:
                    del st.session_state['db']
                    del st.session_state['pdf']
                    del st.session_state['documents']
                del st.session_state['plugin']
                    
                st.experimental_rerun()
                            
# UPLOAD PREVIOUS VECTORSTORE
        if st.session_state['plugin'] == "💾 Upload saved VectorStore" and 'old_db' not in st.session_state:
            with st.expander("💾 Upload saved VectorStore", expanded=True):
                db_file = st.file_uploader("Upload a saved VectorStore", type=["zip"])
                if db_file is not None and st.button('✅💾 Add saved VectorStore to context'):
                    if db_file != "":
                        with st.spinner('💾 Extracting VectorStore...'):
                            # unzip file in a new directory
                            with ZipFile(db_file, 'r') as zipObj:
                                # Extract all the contents of zip file in different directory
                                random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
                                zipObj.extractall("chroma_db_" + random_str)
                            # save in session state the path of the directory
                            st.session_state['old_db'] = "chroma_db_" + random_str
                            hf = hf_obj
                            # Create retriever interface
                            db = Chroma("chroma_db_" + random_str, embedding_function=hf)

                        with st.spinner('💾 Creating QA chain...'):
                            retriever = db.as_retriever()
                            # Create QA chain
                            qa = RetrievalQA.from_chain_type(llm=st.session_state['LLM'], chain_type='stuff', retriever=retriever, return_source_documents=True)
                            st.session_state['old_db'] = qa
                            st.experimental_rerun()

        if st.session_state['plugin'] == "💾 Upload saved VectorStore":
            if st.button('🛑💾 Remove VectorStore from context'):
                if 'old_db' in st.session_state:
                    del st.session_state['old_db']
                del st.session_state['plugin']
                st.experimental_rerun()

# END OF PLUGIN
    add_vertical_space(4)
    if 'hf_email' in st.session_state:
        if st.button('🗑 Logout'):
            keys = list(st.session_state.keys())
            for key in keys:
                del st.session_state[key]
            st.experimental_rerun()

# User input
# Layout of input/response containers
input_container = st.container()
response_container = st.container()
data_view_container = st.container()
loading_container = st.container()

## Applying the user input box
with input_container:
        input_text = st.chat_input("🧑‍💻 Write here 👇", key="input")

with data_view_container:
    if 'df' in st.session_state:
        with st.expander("🤖 View your **DATA**"):
            st.data_editor(st.session_state['df'], use_container_width=True)
    if 'pdf' in st.session_state:
        with st.expander("🤖 View your **DOCUMENTs**"):
            st.write(st.session_state['documents'])
    if 'web_text' in st.session_state:
        with st.expander("🤖 View the **Website content**"):
            st.write(st.session_state['web_text'])
    if 'old_db' in st.session_state:
        with st.expander("🗂 View your **saved VectorStore**"):
            st.success("📚 VectorStore loaded")
    if 'god_mode_source' in st.session_state:
        with st.expander("🌍 View source"):
            for s in st.session_state['god_mode_source']:
                st.markdown("- " + s)

# Response output
## Function for taking user prompt as input followed by producing AI generated responses
def generate_response(prompt):
    final_prompt =  ""
    make_better = True
    source = ""

    with loading_container:

        if st.session_state['plugin'] == "📋 Talk with your DATA" and 'df' in st.session_state:
            #get only last message
            context = f"User: {st.session_state['past'][-1]}\nBot: {st.session_state['generated'][-1]}\n"
            if prompt.find('python') != -1 or prompt.find('Code') != -1 or prompt.find('code') != -1 or prompt.find('Python') != -1:
                with st.spinner('🚀 Using tool for python code...'):
                    solution = "\n```python\n" 
                    solution += st.session_state['df'].sketch.howto(prompt, call_display=False)
                    solution += "\n```\n\n"
                    final_prompt = prompt4Code(prompt, context, solution)
            else:  
                with st.spinner('🚀 Using tool to get information...'):
                    solution = st.session_state['df'].sketch.ask(prompt, call_display=False)
                    final_prompt = prompt4Data(prompt, context, solution)


        elif st.session_state['plugin'] == "📝 Talk with your DOCUMENTS" and 'pdf' in st.session_state:
            #get only last message
            context = f"User: {st.session_state['past'][-1]}\nBot: {st.session_state['generated'][-1]}\n"
            with st.spinner('🚀 Using tool to get information...'):
                result = st.session_state['pdf']({"query": prompt})
                solution = result["result"]
                if len(solution.split()) > 110:
                    make_better = False
                    final_prompt = solution
                    if 'source_documents' in result and len(result["source_documents"]) > 0:
                        final_prompt += "\n\n✅Source:\n" 
                        for d in result["source_documents"]:
                            final_prompt += "- " + str(d) + "\n"
                else:
                    final_prompt = prompt4Context(prompt, context, solution)
                    if 'source_documents' in result and len(result["source_documents"]) > 0:
                        source += "\n\n✅Source:\n"
                        for d in result["source_documents"]:
                            source += "- " + str(d) + "\n"


        elif st.session_state['plugin'] == "🧠 GOD MODE" and 'god_mode' in st.session_state:
            #get only last message
            context = f"User: {st.session_state['past'][-1]}\nBot: {st.session_state['generated'][-1]}\n"
            with st.spinner('🚀 Using tool to get information...'):
                result = st.session_state['god_mode']({"query": prompt})
                solution = result["result"]
                if len(solution.split()) > 110:
                    make_better = False
                    final_prompt = solution
                    if 'source_documents' in result and len(result["source_documents"]) > 0:
                        final_prompt += "\n\n✅Source:\n" 
                        for d in result["source_documents"]:
                            final_prompt += "- " + str(d) + "\n"
                else:
                    final_prompt = prompt4Context(prompt, context, solution)
                    if 'source_documents' in result and len(result["source_documents"]) > 0:
                        source += "\n\n✅Source:\n"
                        for d in result["source_documents"]:
                            source += "- " + str(d) + "\n"


        elif st.session_state['plugin'] == "🔗 Talk with Website" and 'web_sites' in st.session_state:
            #get only last message
            context = f"User: {st.session_state['past'][-1]}\nBot: {st.session_state['generated'][-1]}\n"
            with st.spinner('🚀 Using tool to get information...'):
                result = st.session_state['web_sites']({"query": prompt})
                solution = result["result"]
                if len(solution.split()) > 110:
                    make_better = False
                    final_prompt = solution
                    if 'source_documents' in result and len(result["source_documents"]) > 0:
                        final_prompt += "\n\n✅Source:\n" 
                        for d in result["source_documents"]:
                            final_prompt += "- " + str(d) + "\n"
                else:
                    final_prompt = prompt4Context(prompt, context, solution)
                    if 'source_documents' in result and len(result["source_documents"]) > 0:
                        source += "\n\n✅Source:\n"
                        for d in result["source_documents"]:
                            source += "- " + str(d) + "\n"
                    

        elif st.session_state['plugin'] == "💾 Upload saved VectorStore" and 'old_db' in st.session_state:
            #get only last message
            context = f"User: {st.session_state['past'][-1]}\nBot: {st.session_state['generated'][-1]}\n"
            with st.spinner('🚀 Using tool to get information...'):
                result = st.session_state['old_db']({"query": prompt})
                solution = result["result"]
                if len(solution.split()) > 110:
                    make_better = False
                    final_prompt = solution
                    if 'source_documents' in result and len(result["source_documents"]) > 0:
                        final_prompt += "\n\n✅Source:\n" 
                        for d in result["source_documents"]:
                            final_prompt += "- " + str(d) + "\n"
                else:
                    final_prompt = prompt4Context(prompt, context, solution)
                    if 'source_documents' in result and len(result["source_documents"]) > 0:
                        source += "\n\n✅Source:\n"
                        for d in result["source_documents"]:
                            source += "- " + str(d) + "\n"

        else:
            #get last message if exists
            if len(st.session_state['past']) == 1:
                context = f"User: {st.session_state['past'][-1]}\nBot: {st.session_state['generated'][-1]}\n"
            else:
                context = f"User: {st.session_state['past'][-2]}\nBot: {st.session_state['generated'][-2]}\nUser: {st.session_state['past'][-1]}\nBot: {st.session_state['generated'][-1]}\n"
            
            if 'web_search' in st.session_state:
                if st.session_state['web_search'] == "True":
                    with st.spinner('🚀 Using internet to get information...'):
                        internet_result = ""
                        internet_answer = ""
                        with DDGS() as ddgs:
                            ddgs_gen = ddgs.text(prompt, region=st.session_state['region'], safesearch=st.session_state['safesearch'], timelimit=st.session_state['timelimit'])
                            for r in islice(ddgs_gen, st.session_state['max_results']):
                                internet_result += str(r) + "\n\n"
                            fast_answer = ddgs.answers(prompt)
                            for r in islice(fast_answer, 2):
                                internet_answer += str(r) + "\n\n"

                        final_prompt = prompt4conversationInternet(prompt, context, internet_result, internet_answer)
                else:
                    final_prompt = prompt4conversation(prompt, context)
            else:
                final_prompt = prompt4conversation(prompt, context)

        if make_better:
            with st.spinner('🚀 Generating response...'):
                print(final_prompt)
                response = st.session_state['chatbot'].chat(final_prompt, temperature=temperature, top_p=top_p, repetition_penalty=repetition_penalty, top_k=top_k, max_new_tokens=max_new_tokens)
                response += source
        else:
            print(final_prompt)
            response = final_prompt

    return response

## Conditional display of AI generated responses as a function of user provided prompts
with response_container:
    if input_text and 'hf_email' in st.session_state and 'hf_pass' in st.session_state:
        response = generate_response(input_text)
        st.session_state.past.append(input_text)
        st.session_state.generated.append(response)
    

    #print message in normal order, frist user then bot
    if 'generated' in st.session_state:
        if st.session_state['generated']:
            for i in range(len(st.session_state['generated'])):
                with st.chat_message(name="user"):
                    st.markdown(st.session_state['past'][i])
                
                with st.chat_message(name="assistant"):
                    if len(st.session_state['generated'][i].split("✅Source:")) > 1:
                        source = st.session_state['generated'][i].split("✅Source:")[1]
                        mess = st.session_state['generated'][i].split("✅Source:")[0]

                        st.markdown(mess)
                        with st.expander("📚 Source of message number " + str(i+1)):
                            st.markdown(source)

                    else:
                        st.markdown(st.session_state['generated'][i])

            st.markdown('', unsafe_allow_html=True)
            
            
    else:
        st.info("👋 Hey , we are very happy to see you here 🤗")
        st.info("👉 Please Login to continue, click on top left corner to login 🚀")