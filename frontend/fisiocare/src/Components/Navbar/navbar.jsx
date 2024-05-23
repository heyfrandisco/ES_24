import React, { useEffect } from 'react'
import './navbar.css'
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';

function Navbar() {
  const navigate = useNavigate(); 
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');


  const goToWelcome = () => {
    /*
    let welcome = document.getElementById("welcome");
    welcome.scrollIntoView({behavior: "smooth"});
    */
   navigate('/camera-recognition');
  }

  const goToAbout = () => {
    let about = document.getElementById("about");
    about.scrollIntoView({behavior: "smooth"});
  }

  const goToServices = () => {
    let services = document.getElementById("services");
    services.scrollIntoView({behavior: "smooth"});
  }

  const goToFooter = () => {
    let footer = document.getElementById("footer");
    footer.scrollIntoView({behavior: "smooth"});
  }

  const goToLogin = () => {
    navigate("/login");
  }

  const goToSetAppointment = () => {
    navigate("/set-appointment");
  }

  const goToLogout = () => {
    navigate("/profile");
  }

  useEffect(() => {
    //get token from local storage
    const tok = localStorage.getItem('token');
    setToken(tok);

    //decode token
    if (tok) {
      const base64Url = tok.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const user = JSON.parse(jsonPayload);
      
      setUsername(user.username);
    }


  }, [token]);

  return (
    <div className='navbar'>
        <div><a className="about" onClick={goToWelcome}><h1 className='logo'>FisioCare</h1></a></div>
        <div className='menu'>
          {token ? (
            <>
              <a className='menu-item' onClick={goToAbout}>Sobre</a>
              <a className='menu-item' onClick={goToServices}>Serviços</a>
              <a className='menu-item' onClick={goToFooter}>Contactos</a>
              <a className='menu-item' onClick={goToSetAppointment}>Marcar Consulta</a>
              <a className="menu-item" onClick={goToLogout}>{username}</a>
            </>
          ):(
            <>
              <a className='menu-item' onClick={goToAbout}>Sobre</a>
              <a className='menu-item' onClick={goToServices}>Serviços</a>
              <a className='menu-item' onClick={goToFooter}>Contactos</a>
              <a className="menu-item" onClick={goToLogin}>Login</a>
            </>
          )}
            
        </div>
    </div>
  )
}

export default Navbar
