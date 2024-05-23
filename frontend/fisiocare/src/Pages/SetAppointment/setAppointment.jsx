import React, { useEffect } from 'react'
import './setAppointment.css'
import { useState } from 'react'
import {useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function SetAppointment() {
    const navigate = useNavigate();

    //criar um array de horários ocupados
    const [busyTimes, setBusyTimes] = useState([{
        time: '',
        date: ''
    }]);
    const [specialities, setSpecialities] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [app, setApp] = useState({});
    const [appointment, setAppointment] = useState({
        date: '',
        hour: '',
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

        ///verificar no array de horários ocupados se o horário selecionado está ocupado
        //se estiver ocupado, mostrar mensagem de erro
        //se não estiver ocupado, enviar o pedido para o backend e adicionar o novo horário ao array de horários ocupados

        if (busyTimes.some(busyTime => busyTime.time === appointment.hour && busyTime.date === appointment.date)) {
            alert('Horário ocupado');
            return;
        }

        //adicionar o novo horário ao array de horários ocupados
        setBusyTimes([...busyTimes, { time: appointment?.hour, date: appointment?.date }]);

        console.log(busyTimes);


        // request para o backend
        axios.post('http://localhost:8000/set-appointment', appointment,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        )
        .then((response) => {
            console.log("Serializer data: ", response);
            setApp(response?.data);
            console.log("Appointment data: ", app);
            navigate('/payment', { state: { appointment: response?.data } });
        })
        .catch((error) => {
            console.log(error);
        })

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
                        <input type='time' value={appointment.hour} onChange={(e) => setAppointment({ ...appointment, hour: e.target.value })} placeholder='Hora'/>
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
