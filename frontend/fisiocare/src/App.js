import logo from './logo.svg';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Homepage from './Pages/Homepage/homepage';
import Login from './Pages/Login/login';
import Register from './Pages/Register/register';
import SetAppointment from './Pages/SetAppointment/setAppointment';
import Payment from './Pages/Payment/payment';
import Profile from './Pages/Profile/profile';
import CameraRecognition from './Pages/CameraRecognition/cameraRecognition';
import Dashboard from './Pages/Dashboard/dashboard';
import DoctorDashboard from './Pages/DoctorDashboard/doctorDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="*" element={<Navigate to="/"/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/set-appointment" element={<SetAppointment/>}/>
        <Route path='/payment' element={<Payment/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/camera-recognition' element={<CameraRecognition/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='doctor-dashboard' element={<DoctorDashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
