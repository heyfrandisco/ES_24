import React from 'react'
import './appointmentCard.css'

function AppointmentCard({appointment}) {
  return (
    <div className='appointmentCard-card'>
        <div className='appointmentCard-info'>
            <p>Data: {appointment.date}</p>
            <p>Hora: {appointment.hour}</p>
            <p>Preço: 50€</p>
        </div>
    </div>
  )
}

export default AppointmentCard
