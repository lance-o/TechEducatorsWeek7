import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";


export default function Form(props) {
    // form values with initial values
    const [formValues, setFormValues] = useState({
      content: "",
      image_url: "",
    });

    const [formError, setFormError] = useState("");
  
    function isImg(text) {
      return (text.indexOf(".png") != -1 
      || text.indexOf(".webp") != -1 
      || text.indexOf(".jpg") != -1 ||
       text.indexOf(".jpeg") != -1 || 
       text.indexOf(".bmp") != -1);
    }

    async function attemptSubmitForm(event, user){
      let user_id = user.id;
      let content = formValues.content;
      let image_url = formValues.image_url;
      await fetch("http://localhost:8080/newpost", {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({user_id, content, image_url}),
    });
    setFormValues({
      content: "",
      image_url: "",
    });
    props.getPosts();
  }

    function handleSubmit(event) {
      event.preventDefault();
      let tempError = "";
      if(!props.currUser.user_name){
        tempError +=`You must be logged in to make posts.\n`;
      }
      if(formValues.content == ""){
        tempError +=`Your post must have at least one character.\n`;
      }
      else if(formValues.content.length>300){
        tempError +=`You cannot have more than 300 characters in one post.\n`;
      }
      if(formValues.image_url != ""){
        if(!isImg(formValues.image_url)){
          tempError +=`"${formValues.image_url}" is not an image.\n`;
        }
      }
      if (tempError !== "") {
        setFormError(tempError);
      } else {
        setFormError("");
        attemptSubmitForm(event, props.currUser);
        console.log("Form has been submitted");
      }
    }
  
    function handleInputChange(event) {
      setFormValues({
        ...formValues, // the spread operator will add all existing values
        [event.target.name]: event.target.value, // then we add the new value using the form field "name" attribute and the value
      });
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <div className="FormArea">
          <textarea
            className="FormContent"
            type="text"
            id="content"
            name="content"
            value={formValues.content}
            placeholder="New post..."
            onChange={handleInputChange}
          >
            <h1 className="FormButton">rrrrrrrrrrrrrrrrrrrrrr</h1>
          </textarea>
          <button className="FormButton" type="submit">Submit</button>
          </div>
          <label htmlFor="image_url">Image Url</label>
          <input
            className="FormURL"
            type="image_url"
            id="image_url"
            name="image_url"
            value={formValues.image_url}
            placeholder="Link an image here..."
            onChange={handleInputChange}
          />
        {formValues.image_url != "" ?
        <div>
          <p>Image Preview</p>
          <img src={formValues.image_url}></img>
        </div>
        : null}
        {formError !== "" && <p className="error">{formError}</p>}
        
      </form>
    );
  }
  
  
