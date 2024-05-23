import React, { useEffect } from 'react'
import { useState } from 'react'
import './doctorDashboard.css'
import DoctorDashboardCard from '../../Components/DoctorDashboardCard/doctorDashboardCard'
import axios from 'axios'

export default function DoctorDashboard() {

  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    //get the appointments from the backend
     axios.get('http://localhost:8000/waiting-room')
     .then((response) => {
         console.log(response);
         setAppointments(response?.data?.appointments);
     })
     .catch((error) => {
         console.log(error);
     })
  }, []);



  return (
    <div className='doctor-dashboard-page'>
        <h1>Admin Dashboard</h1>
        <div className='doctor-dashboard-container'>
            {appointments.map((appointment) => {
                return <DoctorDashboardCard key={appointment} appointment={appointment}/>
            })}
        </div>
      
    </div>
  )
}
