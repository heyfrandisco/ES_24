import React from 'react'
import './doctorDashboardCard.css'

function DoctorDashboardCard({appointment}) {

    const endAppointment = () => {


        //request to backend a atualizar o estado da consulta para terminada


        console.log('Appointment ended')
    }


  return (
    <div className='doctor-dashboard-card'>
        <div className='doctor-dashboard-card-info'>
            <p>Nome: Guilherme</p>
        </div>
        <div className='doctor-dashboard-card-info'>
            <p>Especialidade: Fisioterapia</p>
            <p>Hora: 16:00</p>
        </div>
        <button className='doctor-dashboard-card-button' onClick={endAppointment}>Terminar</button>
      
    </div>
  )
}

export default DoctorDashboardCard
