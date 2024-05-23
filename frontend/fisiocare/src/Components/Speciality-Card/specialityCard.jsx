import React from 'react'
import './specialityCard.css'
import image from '../../Assets/fisioterapia.jpeg'

function EspecialityCard(props) {
  
  return (
    <div className='speciality-card'>
        <h2 className='speciality-card-title'>{props.speciality}</h2>
    </div>
  )
}

export default EspecialityCard
