import React from 'react'
import './register.css'
import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {

    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(userData);

        // request para o backend
        axios.post(process.env.BACKEND_API_URL + '/register', userData)
        .then((response) => {
            //if responde is 201
            if (response.status === 201) {
                navigate('/login');
            }
        })
        .catch((error) => {
            console.log(error);
        });


        setUserData({
            name: '',
            email: '',
            password: '',
        });
    };

  return (
    <div className='register-page'>
        <div className='register-card'>
            <h2 className='register-card-title'>Registo</h2>
            <form className='register-form' onSubmit={handleSubmit}>
                <div className='register-card-input'>
                    <p>Nome</p>
                    <input 
                        type='text' 
                        value={userData.username} 
                        onChange={(e) => setUserData({ ...userData, username: e.target.value })} 
                        placeholder='Nome'
                    />
                </div>
                <div className='register-card-input'>
                    <p>Email</p>
                    <input 
                        type='email' 
                        value={userData.email} 
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })} 
                        placeholder='Email'
                    />
                </div>
                <div className='register-card-input'>
                    <p>Password</p>
                    <input 
                        type='password' 
                        value={userData.password} 
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })} 
                        placeholder='Password'
                    />
                </div>
                <button type="submit" className='register-card-button'>Registar</button>
            </form>
        </div>
    </div>
  )
}
