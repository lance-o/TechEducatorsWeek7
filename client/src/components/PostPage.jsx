import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Post from "./Post";

export default function PostPage(props) {
  let { postId } = useParams();
  const [post, setPost] = useState([]);

  async function getPost() {
    // call the api
    const response = await fetch(
      "https://techeducatorsweek7server.onrender.com/post",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      }
    );
    // get the data from the response
    const data = await response.json();
    console.log(data);
    // update our state with that new data
    setPost(data);
  }

  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      {post.map(function (thisPost) {
        return (
          <Post
            key={thisPost.id}
            id={thisPost.id}
            user_id={post.user_id}
            user_name={thisPost.user_name}
            content={thisPost.content}
            img_url={thisPost.img_url}
            didUserLikePost={props.didUserLikePost}
            likePost={props.likePost}
          />
        );
      })}
    </>
  );
}
