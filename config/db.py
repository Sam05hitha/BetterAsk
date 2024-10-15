import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os
from fastapi import  HTTPException, Depends

# Load environment variables from .env file
load_dotenv()

# PostgreSQL connection settings
DATABASE_URL = os.getenv("DATABASE_URL")

# Create a connection to the PostgreSQL database
conn = psycopg2.connect(DATABASE_URL, sslmode='require')

# Create a cursor object to interact with the database
cursor = conn.cursor()

def get_db_connection():
    return psycopg2.connect(DATABASE_URL, sslmode='require')

def get_db_cursor(db: psycopg2.extensions.connection = Depends(get_db_connection)):
    cursor = db.cursor()
    try:
        yield cursor
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        cursor.close()


# Function to create tables
def create_tables():
    # Create the 'users' table
    create_users_table_query = """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL
    );
    """
    cursor.execute(create_users_table_query)
    
    # Create the 'user_conversation_history' table with timestamp
    create_user_conversation_history_table_query = """
    CREATE TABLE IF NOT EXISTS user_conversation_history (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        user_query TEXT NOT NULL,
        assistant_response TEXT NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    """
    cursor.execute(create_user_conversation_history_table_query)

    # Commit the changes
    conn.commit()

# Function to drop tables
def drop_tables():
    # Drop the 'user_conversation_history' table
    drop_user_conversation_history_table_query = "DROP TABLE IF EXISTS user_conversation_history CASCADE;"
    cursor.execute(drop_user_conversation_history_table_query)

    # Drop the 'users' table
    drop_users_table_query = "DROP TABLE IF EXISTS users CASCADE;"
    cursor.execute(drop_users_table_query)

    # Commit the changes
    conn.commit()

# Function to create a user
def create_user(email, db: psycopg2.extensions.connection = Depends(get_db_cursor)):
    create_user_query = "INSERT INTO users (email) VALUES (%s) RETURNING id;"
    cursor.execute(create_user_query, (email,))
    user_id = cursor.fetchone()[0]
    conn.commit()
    return user_id

# Function to get or create user_id
def get_or_create_user_id(session_id, db: psycopg2.extensions.connection = Depends(get_db_cursor)):
    check_user_query = "SELECT id FROM users WHERE email = %s;"
    cursor.execute(check_user_query, (session_id,))
    user_result = cursor.fetchone()

    if user_result is None:
        user_id = create_user(session_id)
    else:
        user_id = user_result[0]

    return user_id

# Function to insert user conversation history
def insert_user_conversation_history(user_id, user_query, assistant_response, db: psycopg2.extensions.connection = Depends(get_db_cursor)):
    insert_query = "INSERT INTO user_conversation_history (user_id, user_query, assistant_response) VALUES (%s, %s, %s) RETURNING id;"
    cursor.execute(insert_query, (user_id, user_query, assistant_response))
    conversation_id = cursor.fetchone()[0]
    conn.commit()
    return conversation_id

# Close the cursor and connection
cursor.close()
conn.close()
