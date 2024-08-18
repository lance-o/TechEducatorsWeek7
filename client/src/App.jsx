import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PageNotFound from "./components/PageNotFound";
import HomePage from "./components/HomePage";
import UserPage from "./components/UserPage";
import PostPage from "./components/PostPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Button from "./components/Button";

let currUserName = "";

export default function App() {
  const [currUser, setCurrUser] = useState({});
  const [userLikes, setUserLikes] = useState({});

  function setUser(user) {
    setCurrUser(user);
    //getLikes();
  }

  function clearUser(event) {
    event.stopPropagation();
    setCurrUser({});
  }

  // async function getLikes(user_id, post_id) {
  //   // call the api
  //   let user_id = currUser.id;
  //   const response = await fetch("http://localhost:8080/userlikedthis", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ post_id }),
  //   });
  //   // get the data from the response
  //   const data = await response.json();
  //   // update our state with that new data
  //   setUserLikes(data);
  // }

  async function didUserLikePost(post_id) {
    // call the api
    let user_id = currUser.id;
    if(user_id == null){
      user_id = 0;
    }
    console.log("HIII");
    const response = await fetch("http://localhost:8080/userlikedthis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({user_id, post_id}),
    });
    // get the data from the response
    const data = await response.json();
    if(data[0]!= null){
      console.log(data[0]);
      return true;
    }
    // update our state with that new data
  }

  function returnReadableDate(rawTime) {
    let date = new Date(rawTime - new Date().getTimezoneOffset() * 60000);
    let formattedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    return formattedDate;
  }

  return (
    <BrowserRouter>
      <div className="App">
        {currUser.id ? (
          <div className="TopButtons">
            <h3>Signed in as {currUser.user_name}</h3>
            <div
              className="Button"
              onClick={(event) => {
                clearUser(event);
              }}
            >
              Sign Out
            </div>
          </div>
        ) : (
          <div className="TopButtons">
            <h3>Not signed in</h3>
            <Button link="/login" name="Log In"></Button>
            <Button link="/signup" name="Sign Up"></Button>
          </div>
        )}
        <div></div>

        <Link className="Title" to="/">
          Twitter 2
        </Link>
        <Routes>
          <Route path="/" element={<HomePage currUser={currUser} didUserLikePost={didUserLikePost}/>} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/posts/:postId" element={<PostPage didUserLikePost={didUserLikePost}/>} />
          <Route path="/users/:username" element={<UserPage didUserLikePost={didUserLikePost}/>}>
            <Route path="posts" element={<PageNotFound />} />
            <Route path="likes" element={<PageNotFound />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
