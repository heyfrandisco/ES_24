import React, { useEffect } from 'react'
import './services.css'
import EspecialityCard from '../Speciality-Card/specialityCard'
import axios from 'axios';
import { useState } from 'react';



function Services() {

  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    //get the specialities from the backend
    axios.get('http://localhost:8000/specialities/', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    )
    .then((response) => {
        setSpecialities(response?.data?.Specialties);
    })
    .catch((error) => {
        console.log(error);
    })

  }
  , []);


  return (
    <div className='homepage-services' id='services'>
        <div className='homepage-services-text'>
            <h1>Serviços</h1>
        </div>
        <div className='homepage-services-cards'>
            {specialities.map((speciality) => {
                return <EspecialityCard key={speciality} speciality={speciality}/>
            })}
        </div>
    </div>
  )
}

export default Services
