import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf'; // Biblioteca para gerar PDFs
import html2canvas from 'html2canvas'; // Biblioteca para converter HTML em imagem
import './AppointmentInvoice.css';
import emailjs from 'emailjs-com'; // Biblioteca para enviar emails



const AppointmentInvoice = ({appointment, vat}) => {

  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState(''); 

  // Obter o nome e email do utilizador através do token


  // Função para gerar PDF
  
  const generatePDF = async () => {
    const element = document.getElementById('invoice-container'); // Seleciona o elemento HTML da fatura
    const canvas = await html2canvas(element); // Converte o HTML em imagem
    const imgData = canvas.toDataURL('image/png'); // Obtém os dados da imagem

    const pdf = new jsPDF(); // Cria um novo objeto PDF
    pdf.addImage(imgData, 'PNG', 0, 0); // Adiciona a imagem ao PDF
    pdf.save('Fatura_' + appointment.name + '.pdf'); // Salva o PDF com o nome do cliente


    //create a new file reader
    const reader = new FileReader();
    //read pdf otimized.pdf as data url
    reader.readAsDataURL(pdf.output('blob'));

    //print pdf size
    //console.log(pdf.output('blob').size);

    reader.onload = async (e) => {

        const serviceID = 'service_uztbwkf';
        const templateID = 'template_u1m35bn';
        const userID = 'RrsZt6y5a8U6OsQ7C';

        const emailParams = {
            to_name: username,
            to_email: email,
            file: reader.result
        };

        const attachments = [
            {
                name: 'Fatura_' + username + '.pdf',
                data: reader.result
            }
        ];


        emailjs.send(serviceID, templateID, emailParams, userID, attachments)
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });

    };

    //TODO: TAMANHO DO PDF MUITO GRANDE E NÃO É ENVIADO POR EMAIL
  };

  // Função para enviar email com a fatura em PDF
  const sendEmailWithPDF = () => {
    console.log("Sending email with PDF")
    emailjs.send({
      service_id: 'service_uztbwkf', // ID do serviço no EmailJS

      user_id: 'RrsZt6y5a8U6OsQ7C',
      from_name: 'FisioCare', // Nome do remetente
      from_email: 'fisiocareclinic24@gmail.com', // Email do remetente
      to_name: username, // Nome do destinatário
      to_email: email, // Email do destinatário
    
      subject: 'Fatura da sua Consulta - FisioCare', // Assunto do email
      text: 'Em anexo encontrará a fatura da sua consulta.', // Corpo do email
      
      /*
      attachments: [
        {
          name: 'Fatura_' + appointment.name + '.pdf', // Nome do arquivo PDF
          path: '../../Invoices/', // Caminho para o arquivo PDF
          type: 'application/pdf', // Tipo de arquivo
        },
      ],
      */
    });
  };




  return (
    <div className='invoice-page'>
      <div className='invoice-container' id="invoice-container">
        <h2>Fatura da Consulta</h2>
        <div className='invoice-text'>
            <p>Nome: {username}</p>
            <p>Email: {email}</p>
            <p>Data: {appointment.date}</p>
            <p>Hora: {appointment.time}</p>
            <p>Especialidade: {appointment.speciality}</p>
            <p>Médico: {appointment.doctor}</p>
            <p>Número de Contribuinte: {vat}</p>
            <p>Valor da Consulta: €75</p>
        </div>
      </div>
      <button className='invoice-button' onClick={generatePDF}>Gerar Fatura</button>
    </div>
  );
};

export default AppointmentInvoice;