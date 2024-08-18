import express, { response } from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
const port = 8080;

app.use(express.json());
dotenv.config();
app.use(cors());

// Get database
const db = new pg.Pool({
  connectionString: process.env.DATABASE_CONNECTION,
});

// Get all posts from the database
app.get("/posts", async function (request, response) {
  const result = await db.query(`SELECT
  posts.id,
  posts.user_id,
  users.username AS user_name,
  posts.content,
  posts.img_url
FROM posts
LEFT JOIN users ON users.id = posts.user_id
ORDER BY posts.post_date DESC`);
  const posts = result.rows;
  response.json(posts);
});

// Get a post from the database
app.post("/post", async function (request, response) {
  const result = await db.query(`SELECT
    posts.id,
    posts.content,
    posts.post_date,
    posts.img_url,
    users.username AS user_name,
    users.avatar_url AS user_pic
  FROM posts
  LEFT JOIN users ON users.id = posts.user_id
  WHERE posts.id = ${request.body.postId}`);
  const posts = result.rows;
  console.log(posts);
  response.json(posts);
});

// Get all posts from the database
app.post("/user", async function (request, response) {
  const result = await db.query(`SELECT
  users.id,
  users.username AS user_name,
  users.join_date AS join_date,
  users.avatar_url AS avatar_url,
  users.user_about AS user_about,
  json_agg(posts) AS posts
FROM users
LEFT JOIN posts ON posts.user_id = users.id
WHERE
  users.username = '${request.body.username}'
GROUP BY users.id,posts.post_date
ORDER BY posts.post_date DESC`);
  const posts = result.rows;
  response.json(posts);
});

// Insert new user data into user table
app.post("/signup", function (request, response) {
  console.log("request.body", request.body);
  db.query(`INSERT INTO users (username, join_date)
            VALUES ('${request.body.username}', ${Date.now()});`);
  response.json({ status: "Message Recieved" });
});

// Add new post to database
app.post("/newpost", function (request, response) {
  console.log("request.body", request.body);
  console.log(Date.now());
  db.query(`INSERT INTO posts (user_id, content, img_url, post_date)
            VALUES (${
              request.body.user_id
            }, '${request.body.content}','${request.body.image_url}', ${Date.now()});`);
  response.json({ status: "Message Recieved" });
});

app.post("/postlikes", async function (request, response) {
  const result = await db.query(`SELECT
  posts.user_id,
  posts.content,
  array_agg(users.username) AS liked_by
FROM posts
LEFT JOIN user_like_junction ON user_like_junction.post_id = posts.id
LEFT JOIN users ON users.id = user_like_junction.user_id
where
  posts.id = ${request.body.post_id}
GROUP BY posts.user_id, posts.content
`);
  const posts = result.rows;
  console.log(posts);
  response.json(posts);
});

// // Get all posts from the database
app.post("/userlikes", async function (request, response) {
  const result = await db.query(`SELECT
  users.id,
  users.username,
  array_agg(posts) AS posts
FROM users
LEFT JOIN user_like_junction ON user_like_junction.user_id = users.id
LEFT JOIN posts ON posts.id = user_like_junction.post_id
where
  user_like_junction.user_id = ${request.body.user_id}
GROUP BY user_like_junction.user_id, users.id`);
  const posts = result.rows;
  console.log(posts);
  response.json(posts);
});

// Check if user liked this post
app.post("/userlikedthis", async function (request, response) {
  const result = await db.query(`SELECT
  users.id,
  users.username,
  array_agg(posts) AS posts
FROM users
LEFT JOIN user_like_junction ON user_like_junction.user_id = users.id
LEFT JOIN posts ON posts.id = user_like_junction.post_id
where
  user_like_junction.user_id = ${request.body.user_id}
  AND user_like_junction.post_id = ${request.body.post_id}
GROUP BY user_like_junction.user_id, users.id`);

  const posts = result.rows;
  console.log(posts);
  response.json(posts);
});

// Add a like to requested database
app.post("/likepost", function (request, response) {
  console.log("request.body", request.body);
  db.query(`INSERT INTO user_like_junction (user_id, post_id)
    VALUES (${request.body.user_id}, ${request.body.post_id});`);
  response.json({ status: "Message Recieved" });
});

app.listen(port, function () {
  console.log(`Server running on port ${port}`);
});
