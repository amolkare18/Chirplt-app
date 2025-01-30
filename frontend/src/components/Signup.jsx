import React from 'react'
import image from "./images/image.png"
import { Link } from 'react-router-dom'
import { useEffect,useState } from 'react'
import "./Signup.css";
import { toast } from 'react-toastify';

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const passregex = /^[A-Za-z]\w{7,14}$/;
const notifyA = (msg) => {
    toast.error(msg);
}
const notifyB = (msg) => {
  toast.success(msg)
    ;
}

import {  useNavigate } from "react-router-dom";
const Signup = () => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const postData = () => {
    if (!emailRegex.test(email)) {
      notifyA("invalid email");
      return;
    } else if (!passregex.test(password)) {
      notifyA('password must contain atleast 7 characters and start with later')
      return;


    }

    fetch('/signup', {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        userName: userName,
        email: email,
        password: password
      })
    }).then(res =>  res.json() )
      .then(data => {
        if (data.error) {
          notifyA(data.error);
        } else {
          navigate('/signin');
          notifyB(data.message);
        }
        
        console.log(data);
      });
  }



  return (
      <div className='signup'>
                <div className="form-container">
        <div className="form">
          <img className="signUpLogo" src={image} alt="" />
          <p className="loginPara">
            Sign up to see photos and videos <br /> from your friends
          </p>
          <div>
                      <input type="email" name="email" id="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
                          placeholder="Email" />
          </div>
          <div>
                      <input type="text" name="name" id="name" placeholder="Full Name"
              value={name}
              onChange={(e) => { setName(e.target.value) }}
                      />
          </div>
          <div>
            <input
              type="text"
              name="userName"
              id="username"
              placeholder="Username"
              value={userName}
              onChange={(e) => { setUserName(e.target.value) }}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />
          </div>
          <p
            className="loginPara"
            style={{ fontSize: "12px", margin: "3px 0px" }}
          >
            By signing up, you agree to out Terms, <br /> privacy policy and
            cookies policy.
          </p>
          <input type="submit" id="submit-btn" value="Sign Up" onClick={()=>{postData()}} />
        </div>
        <div className="form2">
          Already have an account ?
          <Link to="/signin">
            <span style={{ color: "blue", cursor: "pointer" }}>Sign In</span>
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Signup