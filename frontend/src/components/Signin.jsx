import { React, useState, useContext } from 'react';
import logo from "./images/image.png"
import { Link,useNavigate } from 'react-router-dom'
import './Signin.css'
import { toast } from 'react-toastify';
import { LoginContext } from '../contexts/loginContext';
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const notifyA = (msg) => {
    toast.error(msg);
}
const notifyB = (msg) => {
  toast.success(msg)
    ;
}

const Signin = () => {
 const{setuserLogin}=useContext(LoginContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  
  const postData = () => {
    if (!emailRegex.test(email)) {
      notifyA("invalid email");
      return;
    }
    

    fetch('/signin', {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        
        email: email,
        password: password
      })
    }).then(res =>  res.json() )
      .then(data => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB("signed in succesfully");
          
          localStorage.setItem("jwt", JSON.stringify(data.token));
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log(data);
          setuserLogin(true);
          navigate('/');
         
        }
        
       
      });
  }
  return (
      <div className='signin'>
          <div>
            
        <div className="loginForm">
          <img className="signUpLogo" src={logo} alt="" />
          <div>
            <input style={ {width:"70%",textAlign:"center"}}type="email" name="email" id="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
                          placeholder="Email" />
          </div>
          <div>
            <input
              style={ {width:"70%",textAlign:"center"}}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />
          </div>
          <input
            style={ {width:"70%",textAlign:"center", backgroundColor:" #1773EA",color:"white", cursor:"pointer"}}type="submit" id="login-btn" value="Sign In" onClick={() => { postData() }} />
        </div>
        <div className="loginForm2">
          Don't have an account ?
          <Link to="/signup">
            <span >Sign Up</span>
          </Link>
        </div>
      </div>
   </div>
   
  )
}

export default Signin