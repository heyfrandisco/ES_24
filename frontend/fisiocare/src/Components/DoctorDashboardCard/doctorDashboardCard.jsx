import React from 'react'
import './doctorDashboardCard.css'
import axios from 'axios'

function DoctorDashboardCard({appointment}) {


    const endAppointment = () => {

        //request to backend a atualizar o estado da consulta para terminada
        axios.post(`http://localhost:8000/end-appointment/${appointment.id}`)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })



        console.log('Appointment ended')
    }


  return (
    <div className='doctor-dashboard-card'>
        <div className='doctor-dashboard-card-info'>
            <p>Nome: {appointment.user_username}</p>
        </div>
        <div className='doctor-dashboard-card-info'>
            <p>Especialidade: {appointment.speciality}</p>
            <p>Hora: {appointment.hour}</p>
        </div>
        <button className='doctor-dashboard-card-button' onClick={endAppointment}>Terminar</button>
      
    </div>
  )
}

export default DoctorDashboardCard
