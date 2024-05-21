import React from 'react'
import Navbar from '../../Components/Navbar/navbar'
import './homepage.css'
import welcomeImage from '../../Assets/fisioterapia.jpeg'
import About from '../../Components/AboutUs/about'
import Services from '../../Components/Services/services'
import Footer from '../../Components/Footer/footer'

export default function Homepage() {


  return (
    <>
        <div className='homepage'>
            <Navbar/>
            <div className='homepage-welcome' id='welcome'>
                <div className='homepage-welcome-text'>
                    <h1>Bem-vindo à FisioCare</h1>
                </div>
            </div>
            <About/>
            <Services/>
            <Footer/>
        </div>
    </>
  )
}
