# Use the official PostgreSQL image from Docker Hub
FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_DB=BetterAsk
ENV POSTGRES_USER=betterask
ENV POSTGRES_PASSWORD=betterask

# Copy SQL scripts to initialize the database
COPY init.sql /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 5432
