import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { createContext } from 'react';
import Navbar from './components/Navbar';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './components/Home'
import Signin from './components/Signin'
import Signup from './components/Signup'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/Profile'
import Createpost from './components/Createpost'
import { LoginContext } from './contexts/loginContext';
import UserProfie from './components/UserProfile';

function App() {
  const [userLogin, setuserLogin] = useState(false);
  return (
    <>
    <BrowserRouter>
        <div className='App'login={setuserLogin}>;
            <LoginContext.Provider value={{setuserLogin}}>
            <Navbar login={userLogin } />
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/signin' element={<Signin/>} />
            <Route path='/signup' element={<Signup/>} />
            <Route exact path='/profile' element={<Profile />} />
              <Route path='/createPost' element={<Createpost />} />
              <Route path='/profile/:userid' element={<UserProfie />} />
                           
              
        </Routes>
            <ToastContainer />
            </LoginContext.Provider>
        </div>
      </BrowserRouter>
      
      
    </>
  )
}

export default App
