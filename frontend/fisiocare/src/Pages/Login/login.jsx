import React from 'react'
import './login.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // post para o backend
    const username1 = username;
    const userPassword = password;

    // request para o backend
    //colocar token no local storage
    console.log(process.env.BACKEND_API_URL);
    axios.post('http://localhost:8000/login', {
      username: username1,
      password: userPassword
    })
    .then((response) => {
      if (response.status === 200) {
        console.log(response.data.Token);
        localStorage.setItem('token', response.data.Token.access);
        navigate('/');
      }
    }
    )
    .catch((error) => {
      console.log(error);
    }
    )
    


    setUsername('');
    setPassword('');
  };


  return (
    <div className='login-page'>
        <div className='login-card'>
            <h2 className='login-card-title'>Login</h2>
            <form className='login-form' onSubmit={handleSubmit}>
                <div className='login-card-input'>
                    <p>Username</p>
                    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username'/>
                </div>
                <div className='login-card-input'>
                    <p>Password</p>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
                </div>
                <button type="submit" className='login-card-button'>Login</button>
            </form>
            <span className='login-card-text'>Não tem conta? <Link to='/register'>Registe-se</Link></span>
      </div>
    </div>
  )
}
