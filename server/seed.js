import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Pool({ connectionString: process.env.DATABASE_CONNECTION });

db.query(`CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(20) unique,
  join_date BIGINT,
  user_about TEXT,
  avatar_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  user_id INT references users(id),
  content TEXT NOT NULL,
  post_date BIGINT,
  img_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS user_like_junction(
  user_id INT REFERENCES users(id),
  post_id INT REFERENCES posts(id)
);

INSERT INTO users (username, join_date)
VALUES ('LarryLurr', 0),
('AllLarryNoLurr', 100000000);

INSERT INTO posts (user_id, content, post_date)
VALUES (2, 'larry lurr', 1000);

INSERT INTO user_like_junction (user_id, post_id)
VALUES (2, 1);
VALUES (1, 1);`);
