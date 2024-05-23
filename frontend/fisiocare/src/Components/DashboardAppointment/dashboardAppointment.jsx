import React from 'react'
import './dashboardAppointment.css'

function DashboardAppointment() {
  return (
    <>
      <div className='dasboard-appointment-card'>
        <div className='dashboard-appointment-patient-info'>
          <p>Guilherme Faria</p>
        </div>
        <div className='dashboard-appointment-info'>
          <p>Hora: 16:00</p>
          <p>Tempo de espera estimado: 20 min</p>
        </div>
        <div className='dashboard-appointment-office-info'>
          <p>Consultório:</p>
          <p>3</p>
        </div>
      </div>
    </>
  )
}

export default DashboardAppointment;
