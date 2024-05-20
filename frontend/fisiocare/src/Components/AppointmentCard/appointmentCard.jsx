import React from 'react'
import './appointmentCard.css'

function AppointmentCard() {
  return (
    <div className='appointmentCard-card'>
        <div className='appointmentCard-info'>
            <p>Data: 2021-05-20</p>
            <p>Hora: 15:00</p>
            <p>Preço: 50€</p>
        </div>
    </div>
  )
}

export default AppointmentCard
