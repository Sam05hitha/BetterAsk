# webbie

docker build -t webbie-test-1 . && docker run -p 8000:8000 webbie-test-1:latest

docker build -t postgres-test-1 . && docker run -p 2762:5432 postgres-test-1:latest
