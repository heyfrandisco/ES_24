import React from 'react'
import './specialityCard.css'
import image from '../../Assets/fisioterapia.jpeg'

function EspecialityCard(props) {
  
  return (
    <div className='speciality-card'>
        <img src={image} className='speciality-card-image' alt='speciality'/>
        <h2 className='speciality-card-title'>{props.speciality}</h2>
        <p className='speciality-card-text'> 
            A recuperação muscular é um processo que visa a recuperação de lesões musculares. 
            Na FisioCare, oferecemos um serviço de recuperação muscular de qualidade, 
            com uma equipa de profissionais qualificados e experientes.
        </p>
    </div>
  )
}

export default EspecialityCard
