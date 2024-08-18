import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
export default function Post(props) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  async function likePost() {}

  useEffect(() => {
    getCurrUserLikedThis(props.id);
    getNumLikes(props.id);
  }, []);

  async function getCurrUserLikedThis(post_id) {
    console.log("plz werk");
    setLiked(await props.didUserLikePost(post_id));
  }

  async function getNumLikes(post_id) {
    const response = await fetch("http://localhost:8080/postlikes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({post_id}),
    });

    // get the data from the response
    const data = await response.json();
    if(data[0].liked_by[0]!= null){
      console.log(data[0].liked_by);
      setLikes(data[0].liked_by.length);
    }
    return 0;
  }
  const handleNavigation = (event, childRoute) => {
    event.stopPropagation();
    navigate(childRoute);
  };

  return (
    <>
      <br></br>
      <div className="OnePost">
        <div
          onClick={(event) => {
            handleNavigation(event, `/posts/${props.id}`);
          }}
        >
          <span className={"post-body"}>
            <div
              className={"post-username"}
              onClick={(event) => {
                handleNavigation(event, `/users/${props.user_name}`);
              }}
            >
              <h4>@{props.user_name}</h4>
            </div>
            <div className="PostContentContainer">
              <p className="PostContent">{props.content}</p>
            </div>
            {props.img_url == null || props.img_url == "" ? null : (
              <div className="PostImgContainer">
                <img className="PostImg" src={props.img_url} />
              </div>
            )}
            <div className="LikesSection">
              <p>{likes}</p>
              {liked == true
              ? <p>liked</p>
              : <p>NOT liked</p>}
            </div>
            <button onClick={likePost} /> 
          </span>
        </div>
      </div>

      <Outlet />
    </>
  );
}
