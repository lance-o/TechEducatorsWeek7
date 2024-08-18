import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate} from "react-router-dom";

export default function LoginPage(props) {
  const navigate = useNavigate();
  // form values with initial values
  const [formValues, setFormValues] = useState({
    name: ""
  });

  const [formError, setFormError] = useState("");

  async function attemptSubmitForm(event, username){
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
    if(!data.length)
      setFormError(`User "${username}" does not exist.\n`);
    else{
      props.setUser(data[0]);
      navigate(`/`);
    }
  }

  function handleSubmit(event) {
    let tempError = "";
    event.preventDefault();
    if(formValues.name == ""){
        tempError += `Username cannot be empty.\n`;
    }
    if (!/^[a-zA-Z0-9_]*$/.test(formValues.name)) {
        tempError += `Username cannot contain special characters. (A-Z, 0-9, _ only)\n`;
    }
    if(formValues.name.length > 20){
        tempError += `Username can only be 20 characters or less.\n`;
    }
    if (tempError !== "") {
        setFormError(tempError);
      } else {
        setFormError("");
        attemptSubmitForm(event, formValues.name);
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
    <form className="LoginForm" onSubmit={handleSubmit}>
        <h1>Log In</h1>
        <div className="UsernameEntry">
        <label htmlFor="name">Username</label>
        <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
        />
        {}
        </div>
        {formError !== "" && <p className="error">{formError}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
