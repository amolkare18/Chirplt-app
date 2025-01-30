import React from 'react'
import image from "./images/chirplt-high-resolution-logo.png";
import "./Navbar.css"
import { Link } from 'react-router-dom';

const Navbar = ({login}) => {
  const token = localStorage.getItem("jwt");
  console.log({ token })  
  const loginstatus = () => {
    if (login||token) {
      return[
        <>
       <Link to='/'><li>Home</li></Link>
          <Link to='/profile'><li>profile</li></Link>
          <Link to='/createPost'><li>createPost</li></Link> 
          <li style={{cursor:"pointer"} } onClick={() => {
                    localStorage.removeItem('jwt');
            window.location.reload();
               window.location.reload();
                }}>Logout</li>
           
     </>]
            
    } else {
      return [
        <><Link to='/signup'><li>sign up</li></Link>
              
             <Link to='/signin'> <li>sign in</li>
</Link></>
         

       
      ]
    }
  }
 
  return (
      <div className='navbar'>
          <img src={image}></img>  
          <ul>
               {loginstatus()}
          </ul>
     
    </div>
  )
}

export default Navbar
