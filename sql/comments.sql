DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    images_id INTEGER NOT NULL,
    comment VARCHAR (255) NOT NULL CHECK (comment <> ''),
    username VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

