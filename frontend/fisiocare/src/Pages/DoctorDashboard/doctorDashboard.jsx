import React, { useEffect } from 'react'
import { useState } from 'react'
import './doctorDashboard.css'
import DoctorDashboardCard from '../../Components/DoctorDashboardCard/doctorDashboardCard'

export default function DoctorDashboard() {

  const [appointments, setAppointments] = useState([])

  //useEffect(() => {
    //get the appointments from the backend
    // axios.get('http://localhost:8000/appointments/')
    // .then((response) => {
    //     console.log(response);
    //     setAppointments(response?.data?.appointments);
    // })
    // .catch((error) => {
    //     console.log(error);
    // })
  //}
  //, []);



  return (
    <div className='doctor-dashboard-page'>
        <h1>Doctor Dashboard</h1>
        <div className='doctor-dashboard-container'>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
            <DoctorDashboardCard/>
        </div>
      
    </div>
  )
}
