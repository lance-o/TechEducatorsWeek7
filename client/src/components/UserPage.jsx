import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Post from "./Post";

export default function UserPage(props) {
    let { username } = useParams();
    const [user, setUser] = useState([]);


 

  async function getUser() {
    // call the api
    const response = await fetch("https://techeducatorsweek7server.onrender.com/user",
    {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username}),
    });
    // get the data from the response
    const data = await response.json();
    // update our state with that new data
    setUser(data);
  }

  useEffect(() => {
    getUser();
  });

  return (
    <>
    {user.map(function (thisUser) {
        return (
        <div key={thisUser.id}>
            <h1>{username}</h1>
            {thisUser.posts[0] == null 
            ? <h3>This user has no posts</h3> 
            : <>{
                thisUser.posts.map(function (post){
                    return(
                        <Post
                        key={post.id}
                        id={post.id}
                        user_id={post.user_id}
                        user_name={username}
                        content={post.content}
                        img_url={post.img_url}
                        didUserLikePost={props.didUserLikePost}
                        likePost={props.likePost}
                        />
                    )
                })}</> 
            }
            
        </div>
        )
    })}
    </>
  );
}