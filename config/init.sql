CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS user_conversation_history (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    user_query TEXT NOT NULL,
    assistant_response TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE user_feedback (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    feedback_id SERIAL,
    user_feedback TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE user_response_feedback (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL, 
    conversation_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (conversation_id) REFERENCES user_conversation_history(id),
    response_feedback_id SERIAL,
    like_dislike BOOLEAN,
    response_feedback TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);