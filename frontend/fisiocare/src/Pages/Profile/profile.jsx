import React, { useEffect } from 'react'
import './profile.css'
import AppointmentCard from '../../Components/AppointmentCard/appointmentCard'
//import close_small from assets
import Close from '../../Assets/close.png';

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([{}]);
    const [user, setUser] = useState({});
    
    useEffect(() => {
        //send request to backend to get user info and appointments
        axios.get('http://localhost:8000/profile', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then((response) => {
            setUser(response?.data?.user);
            setAppointments(response?.data?.appointments);
        }
        ).catch((error) => {
            console.log(error);
        });

    }, []);

    const goTo = () => {
        navigate('/doctor-dashboard');
    }

    const goBack = () => {
        window.history.back();
    }

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

  return (
    <div className='profile-page'>
        <div className='profile-container'>
            <div className='profile-header'>
                <div className='profile-info'>
                    <h2>Perfil de {user.username}</h2>
                    <p>Nome: {user.username}</p>
                    <p>Email: {user.email}</p>
                </div>
                <div className='profile-image'>
                    <img className='profile-pic' src='https://www.w3schools.com/howto/img_avatar.png' onClick={goTo} alt='profile'/>
                    <img className='go-back-button' src={Close} onClick={goBack} alt='profile'/>
                </div>
            </div>
            
            <div className='profile-historic'>
                <h3>Histórico de Consultas</h3>
                <div className='profile-appointments'>
                    {appointments.map((appointment) => {
                        return <AppointmentCard key={appointment.id} appointment={appointment}/>
                    })}
                </div>
                <button className='profile-logout-button' onClick={logout}>LOGOUT</button>
            </div>
        </div>
    </div>
  )
}
