import React, { useEffect } from 'react'
import './setAppointment.css'
import { useState } from 'react'
import {useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function SetAppointment() {
    const navigate = useNavigate();

    //criar um array de horários ocupados
    const [busyTimes, setBusyTimes] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [doctors, setDoctors] = useState([]);


    const [appointment, setAppointment] = useState({
        date: '',
        time: '',
        speciality: '',
        doctor: ''
    });

    useEffect(() => {
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

    }, []);

    //send request to backend to get doctors for the selected speciality
    useEffect(() => {
        axios.get(`http://localhost:8000/doctors/${appointment.speciality}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
        )
        .then((response) => {
            setDoctors(response?.data?.doctors);
        })
        .catch((error) => {
            console.log(error);
        })

    }, [appointment.speciality]);




    const handleSubmit = (e) => {
        e.preventDefault();

        //verificar se o horário está ocupado
        const isTimeBusy = busyTimes.some(busyTime => busyTime === appointment.time);
        if(isTimeBusy) {
            alert('Horário ocupado, por favor escolha outro horário');
            return;
        }else {
            setBusyTimes([...busyTimes, appointment.time]);
            console.log(busyTimes);
        }

        console.log(appointment);

        /*setAppointment(updatedAppointment);*/

        // request para o backend
        axios.post('http://localhost:8000/set-appointment', appointment,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        )
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })

        

        navigate('/payment', { state: { appointment: appointment } });

        setAppointment({
            date: '',
            time: '',
            speciality: '',
            doctor: ''
        });
    }




  return (
    <div className='appointment-page'>
        <div className='appointment-card'>
            <h2 className='appointment-card-title'>Marcar Consulta</h2>
            <form className='appointment-form' onSubmit={handleSubmit}>
                    <div className='appointment-card-input'>
                        <p>Data</p>
                        <input type='date' value={appointment.date} onChange={(e) => setAppointment({ ...appointment, date: e.target.value })} placeholder='Data'/>
                    </div>
                    <div className='appointment-card-input'>
                        <p>Hora</p>
                        <input type='time' value={appointment.time} onChange={(e) => setAppointment({ ...appointment, time: e.target.value })} placeholder='Hora'/>
                    </div>
                    <div className='appointment-card-input'>
                        <p>Especialidade</p>
                        <select value={appointment.speciality} onChange={(e) => setAppointment({ ...appointment, speciality: e.target.value })}>
                            {specialities.map((speciality) => (
                                <option key={speciality} value={speciality}>{speciality}</option>
                            ))}
                        </select>
                    </div>
                    <div className='appointment-card-input'>
                        <p>Médico</p>
                        <select value={appointment.doctor} onChange={(e) => setAppointment({ ...appointment, doctor: e.target?.value })}>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
                            ))}
                        </select>
                    </div>
                    <button className='appointment-card-button'>Efetuar Pagamento</button>
            </form>
        </div>      
    </div>
  )
}
