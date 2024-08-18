import { useState, useEffect } from "react";
import Post from "./Post";
import Form from "./Form";

export default function HomePage(props) {
    const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {
    // call the api
    const response = await fetch("http://localhost:8080/posts");
    // get the data from the response
    const data = await response.json();
    // update our state with that new data
    setPosts(data);
  }
  return (
    <>
    <Form currUser={props.currUser} getPosts={getPosts}/>
    {posts.map(function (post) {
        return (
        <Post
        key={post.id}
        id={post.id}
        user_id={post.user_id}
        user_name={post.user_name}
        content={post.content}
        
        img_url={post.img_url}

        didUserLikePost={props.didUserLikePost}
        />
        );
    })}
    </>
  );
}