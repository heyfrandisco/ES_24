import React from 'react'
import './dashboard.css'
import DashboardAppointment from '../../Components/DashboardAppointment/dashboardAppointment'

export default function dashboard() {

    /*get all rows of table recognitions (pessoas que deram entrada na clinica e 
    consequente informação da consulta*/

    


  return (
    <div className='dashboard-page'>
        <div className='dashboard-header'>
            <div className='dashboard-logo'><h1>Fisiocare</h1></div>
            <div className='dashboard-title'><h1>Sala de Espera</h1></div>
        </div>
        <div className='dashboard-appointments'>
            <DashboardAppointment/>
            <DashboardAppointment/>
            <DashboardAppointment/>
            <DashboardAppointment/>
            <DashboardAppointment/>
            <DashboardAppointment/>
            <DashboardAppointment/>
            <DashboardAppointment/>
            <DashboardAppointment/>
            <DashboardAppointment/>
            <DashboardAppointment/>
            <DashboardAppointment/>
        </div>
      
    </div>
  )
}
