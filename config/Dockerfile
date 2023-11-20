# Use the official PostgreSQL image from Docker Hub
FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_DB=BetterAsk
ENV POSTGRES_USER=betterask-posh-1
ENV POSTGRES_PASSWORD=betterask-posh-1+webknot&2023

# Copy SQL scripts to initialize the database
COPY init.sql /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 5432
