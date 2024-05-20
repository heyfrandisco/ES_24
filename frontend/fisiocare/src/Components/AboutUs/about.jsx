import React from 'react'
import './about.css'
import image from '../../Assets/sobre-nos.jpg'

function About() {
  return (
    <div className='homepage-about' id='about'>
      <div className='homepage-about-text'>
        <h1>Sobre Nós</h1>
        <p>Na FisioCare, acreditamos que a fisioterapia é uma ferramenta essencial para a recuperação
            e manutenção da saúde. Com uma equipa de profissionais qualificados e experientes, 
            a FisioCare é o local ideal para quem procura um serviço de fisioterapia de qualidade.
        </p>
      </div>
      <img src={image} alt='fisioterapia' className='homepage-about-image'/>
    </div>
  )
}

export default About
