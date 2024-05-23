import React from 'react'
import './appointmentCard.css'

function AppointmentCard({appointment}) {
  console.log(appointment);
  return (
    <div className='appointmentCard-card'>
        <div className='appointmentCard-info'>
            <p>Data: {appointment.date}</p>
            <p>Hora: {appointment.hour}</p>
            <p>Preço: 50€</p>
            <p>Estado: {appointment.state}</p>
        </div>
    </div>
  )
}

export default AppointmentCard
