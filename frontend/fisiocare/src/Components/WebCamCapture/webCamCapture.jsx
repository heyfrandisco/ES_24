
import React from 'react'
import Webcam from 'react-webcam';
import './webCamCapture.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function WebcamCapture() {
    const navigate = useNavigate();
    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);
  
    const capture = React.useCallback(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      console.log("Image Taken: ", imageSrc)

      //send the image to the backend to be recognized
      axios.post('http://localhost:8000/recognition', {
        img: imageSrc
      },
      {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token') 
      }
      }
      ).then((response) => {
        if (response?.status === 200) {
          console.log(response);
          //navigate to Dashboard page
          navigate('/dashboard');
        }
      }).catch((error) => {
        console.log(error);
      });

        
      //after response (response should contain the patient info and the appointment info)
      //navigate to Dashboard page
      

    }, [webcamRef, setImgSrc]);
  
    return (
      <>
        <Webcam className='webcam' audio={false} ref={webcamRef} screenshotFormat="image/jpeg" mirrored={true}/>
        <button className='webcam-button' onClick={capture}>Capture photo</button>
      </>
    );
  };
  
  export default WebcamCapture