import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf'; // Biblioteca para gerar PDFs
import html2canvas from 'html2canvas'; // Biblioteca para converter HTML em imagem
import './AppointmentInvoice.css';
import emailjs from 'emailjs-com'; // Biblioteca para enviar emails
import { PDFDocument } from 'pdf-lib';
import { useNavigate } from 'react-router-dom';



const AppointmentInvoice = ({appointment, vat}) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState(''); 

  // Obter o nome e email do utilizador através do token
  useEffect(() => {
    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const user = JSON.parse(jsonPayload);
    setUsername(user.username);
    setEmail(user.email);
  }, []);


  // Função para gerar PDF
  
  const generatePDF = async () => {
    const element = document.getElementById('invoice-container'); // Seleciona o elemento HTML da fatura
    const canvas = await html2canvas(element); // Converte o HTML em imagem
    const imgData = canvas.toDataURL('image/jpeg', 0.5); // Obtém os dados da imagem

    const pdf = new jsPDF(); // Cria um novo objeto PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight()); // Adiciona a imagem ao PDF
    // pdf.save('Fatura_' + username + '.pdf'); // Salva o PDF com o nome do cliente


    const pdfBlob = pdf.output('blob');

    const existingPdfBytes = await pdfBlob.arrayBuffer();

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    for (const page of pages) {
        const { width, height } = page.getSize();
        const jpgImageBytes = await fetch(imgData).then(res => res.arrayBuffer());
        const jpgImage = await pdfDoc.embedJpg(jpgImageBytes, { width, height });
        page.drawImage(jpgImage, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });
    }

    const compressedPdfBytes = await pdfDoc.save();

    const compressedPdfBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });


    //create a new file reader
    const reader = new FileReader();
    //read pdf otimized.pdf as data url
    reader.readAsDataURL(compressedPdfBlob);


    reader.onload = async (e) => {

        const serviceID = 'service_uztbwkf';
        const templateID = 'template_u1m35bn';
        const userID = 'RrsZt6y5a8U6OsQ7C';

        const emailParams = {
            to_name: username,
            to_email: email,
            file: reader.result.split(',')[1],
        };

        const templateParams = {
          to_name: username,
          to_email: email,
          message: 'Veja em anexo a fatura solicitada.',
          file: reader.result.split(',')[1],
      };

        emailjs.send(serviceID, templateID, emailParams, userID, templateParams)
            .then((result) => {
                if (result.text === 'OK') {
                    console.log('Email enviado com sucesso');
                    navigate('/');
                }
            }, (error) => {
                console.log(error.text);
            });

    };

  };



  return (
    <div className='invoice-page'>
      <div className='invoice-container' id="invoice-container">
        <h2>Fatura da Consulta</h2>
        <div className='invoice-text'>
            <p>Nome: {username}</p>
            <p>Email: {email}</p>
            <p>Data: {appointment.date}</p>
            <p>Hora: {appointment.hour}</p>
            <p>Especialidade: {appointment.speciality}</p>
            <p>Médico: {appointment.doctor}</p>
            <p>Número de Contribuinte: {vat}</p>
            <p>Valor da Consulta: €75</p>
        </div>
      </div>
      <button className='invoice-button' onClick={generatePDF}>Enviar Fatura</button>
    </div>
  );
};

export default AppointmentInvoice;