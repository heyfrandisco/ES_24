
import React from 'react'
import Webcam from 'react-webcam';
import './webCamCapture.css'
import { useNavigate } from 'react-router-dom';


function WebcamCapture() {
    const navigate = useNavigate();
    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);
  
    const capture = React.useCallback(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      console.log("Image Taken: ", imageSrc)

      //send the image to the backend to be recognized
        
      //after response (response should contain the patient info and the appointment info)
      //navigate to Dashboard page
      navigate("/dashboard");

    }, [webcamRef, setImgSrc]);
  
    return (
      <>
        <Webcam className='webcam' audio={false} ref={webcamRef} screenshotFormat="image/jpeg" mirrored={true}/>
        <button className='webcam-button' onClick={capture}>Capture photo</button>
      </>
    );
  };
  
  export default WebcamCapture