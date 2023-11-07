FROM python:3.9

# Create app directory
WORKDIR /app

# Install app dependencies
COPY ./req.txt ./

RUN pip install -r req.txt

# Bundle app source
COPY . /app

CMD [ "streamlit", "run", "streamlit_app.py" ]

EXPOSE 8080