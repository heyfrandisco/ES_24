import React from 'react'
import './dashboardAppointment.css'

function DashboardAppointment({appointment}) {
  return (
    <>
      <div className='dasboard-appointment-card'>
        <div className='dashboard-appointment-patient-info'>
          <p>{appointment.user_username}</p>
        </div>
        <div className='dashboard-appointment-info'>
          <p>Hora: {appointment.hour}</p>
          <p>Tempo de espera estimado: {appointment.est_time} min</p>
        </div>
        <div className='dashboard-appointment-office-info'>
          <p>Consultório:</p>
          <p>{appointment.room}</p>
        </div>
      </div>
    </>
  )
}

export default DashboardAppointment;
