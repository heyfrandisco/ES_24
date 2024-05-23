import React, { useEffect } from 'react'
import './dashboard.css'
import DashboardAppointment from '../../Components/DashboardAppointment/dashboardAppointment'
import axios from 'axios'
import { useState } from 'react'

export default function Dashboard() {

    const [appointments, setAppointments] = useState([]);

    /*get all rows of table recognitions (pessoas que deram entrada na clinica e 
    consequente informação da consulta, don´t need the token*/
      useEffect(() => {
          axios.get('http://localhost:8000/waiting-room')
        .then((response) => {
            console.log(response);
            setAppointments(response?.data?.appointments);
        })
        .catch((error) => {
            console.log(error);
        }
        )
      }, []);

    console.log(appointments);


  return (
    <div className='dashboard-page'>
        <div className='dashboard-header'>
            <div className='dashboard-logo'><h1>Fisiocare</h1></div>
            <div className='dashboard-title'><h1>Sala de Espera</h1></div>
        </div>
        <div className='dashboard-appointments'>
            {appointments.map((appointment) => {
                return <DashboardAppointment key={appointment} appointment={appointment}/>
            })}
        </div>
      
    </div>
  )
}
