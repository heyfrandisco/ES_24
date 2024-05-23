import React from 'react'
import './footer.css'
import { useNavigate } from 'react-router-dom'

function Footer() {
  const navigate = useNavigate()

  const goTo = () => {
    navigate('/doctor-dashboard')
  }
  return (
    <div className='footer' id='footer'>
      <h1 className='footer-title'>Contactos</h1>
      <div className='footer-info'>
        <div className='footer-contact'>
          <p>Telefone: 239 456 789</p>
          <p>Email: fisiocare@gmail.com</p>
        </div>
        <div className='footer-social'>
          <div className='linkedin'>
            <a className='linkedin' href="#"><img className="linkedin-icon" src={require("../../Assets/linkedin.png")}></img><p>LinkedIn</p></a>
          </div>
          <div className='instagram'>
            <a className='instagram' href="#"><img className="instagram-icon" src={require("../../Assets/instagram.png")}></img><p>Instagram</p></a>
          </div>
          <button className='footer-button' onClick={goTo}>Dashboard</button>
      </div>
      </div>
    </div>
  )
}

export default Footer
