import React from 'react'
import { redirect, useLocation } from 'react-router-dom';
import { useState } from 'react';
import AppointmentInvoice from '../../Components/AppointmentInvoice/AppointmentInvoice';
import './payment.css';
import axios from 'axios';

export default function Payment() {

    const location = useLocation();

    const [vat, setVat] = useState('');

    const [invoice, setInvoice] = useState(false);

    const [numClicks, setNumClicks] = useState(0);

    const [paymentOption, setPaymentOption] = useState('');

    const handleCheckboxChange = (event) => {
        setPaymentOption(event.target.value);
      };

    const [phoneNumber, setPhoneNumber] = useState('');

    const [appointment, setAppointment] = useState({});


    const handlePayment = (e) => {
        e.preventDefault();

        setNumClicks(numClicks + 1);

        //verificar se o botão foi clicado apenas 1 vez
        if(numClicks <= 1) {
            
            //console.log(location?.state?.appointment);
            setAppointment(location?.state?.appointment);
            //console.log(appointment);

            //post to backend with appointment id and the token
            axios.post(`http://localhost:8000/payment/${appointment.id}`,{
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((response) => {
                console.log(response);
                if(response.status === 200){
                    setNumClicks(0);
                    setInvoice(true);
                }
            }
            )
            .catch((error) => {
                console.log(error);
            }
        )
        }else{
            alert('Pagamento já efetuado');
            redirect('/');
        }
    }

    
    //função show para mostrar o pagamento por MBWay

    const showMbway = () => {
        return (
            <>
                <div className='payment-card-input-mbway-checked'>
                    <p>MBWay</p>
                    <input type='number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder='MBWay'/>
                </div>
                <div className='payment-card-input-mbway-checked'>
                    <p>VAT</p>
                    <input type='number' value={vat} onChange={(e) => setVat(e.target.value)} placeholder='VAT'/>
                </div>
                <button type="submit" className='payment-card-button' onClick={handlePayment}>Pagar</button>
            </>
        )
    }

    //função show para mostrar o pagamento por Multibanco

    const showMultibanco = () => {

        //gerar entidade e referência
        let entity = Math.floor(Math.random() * 1000000);
        let reference = Math.floor(Math.random() * 1000000000);

        return (
            <>
                <div className='payment-card-input-mb-checked'>
                    <p>Multibanco</p>
                    <div className='multibanco-card'>
                        <p>Entidade: {entity}</p>
                        <p>Referência: {reference}</p>
                    </div>
                </div>
                <div className='payment-card-input-mbway-checked'>
                    <p>VAT</p>
                    <input type='number' value={vat} onChange={(e) => setVat(e.target.value)} placeholder='VAT'/>
                </div>
                <button type="submit" className='payment-card-button' onClick={handlePayment}>Pagar</button>
            </>
        )
    }

  return (
    <div className='payment-page'>
        {invoice ? (
            <AppointmentInvoice appointment={appointment} vat={vat}/>
        ):(
            <div className='payment-card'>
                <h2 className='payment-card-title'>Pagamento</h2>
                <form className='payment-form'>
                    <div className='payment-card-input'>
                        <p>MBWay</p>
                        <input type='checkbox' value="mbway" checked={paymentOption === 'mbway'} onChange={handleCheckboxChange} placeholder='MBWay'/>
                    </div>
                    <div className='payment-card-input'>
                        <p>Multibanco</p>
                        <input type='checkbox' value="multibanco" checked={paymentOption === 'multibanco'} onChange={handleCheckboxChange} placeholder='Multibanco'/>
                    </div>
                    {paymentOption === 'mbway' && showMbway()}
                    {paymentOption === 'multibanco' && showMultibanco()}
                    
                </form>
            </div>
            )}     
    </div>
  )
}
