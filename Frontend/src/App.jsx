import React,{useContext} from 'react'
import{Route,Routes,Link} from 'react-router-dom';
import UserLogin from './pages/UserLogin';
import Start from './pages/Start';
import UserSignup from './pages/UserSignup';
import CaptainLogin from './pages/CaptainLogin';
import CaptainSignup from './pages/CaptainSignup';
import {UserDataContext} from './UserContext/UserContext';
import Home from './pages/Home';
import UserProtectWrapper from './pages/UserProtectWrapper';
import CaptainProtectWrapper from './pages/CaptainProtectWrapper';
import UserLoggedOut from './pages/UserLoggedOut';
import CaptainHome from './pages/CaptainHome';
import CaptainLoggedOut from './pages/CaptainLoggedOut';
import Riding from './pages/Riding';
import CaptainRiding from './pages/CaptainRiding';
import Chat from './pages/Chat';
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import ProfilePage from './pages/UserProfile';
import CaptainProfile from './pages/CaptainProfile';
import { Toaster } from "react-hot-toast";
import SplashScreen from './pages/SplashScreen';

const App = () => {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
     <Routes>
      <Route path='/' element={<SplashScreen/>}/>
      <Route path='/start' element={<Start/>}/>
      <Route path='/login' element={<UserLogin />}/>
      <Route path='/signup' element={<UserSignup />}/>
      <Route path='/captain-login' element={<CaptainLogin/>}/>
      <Route path='/captain-signup' element={<CaptainSignup/>}/>
      <Route path='/home' element={
        <UserProtectWrapper> <Home/></UserProtectWrapper>
      }/>
      <Route path='/chat' element={
         <Chat/>
      }/>
      <Route path='/logout' element={
        <UserProtectWrapper> <UserLoggedOut/></UserProtectWrapper>
      }/>
      <Route path='/profile' element={
        <UserProtectWrapper> <ProfilePage/></UserProtectWrapper>
      }/>
      <Route path='/captain-home' element={
        <CaptainProtectWrapper> <CaptainHome/></CaptainProtectWrapper>
      }/>
      <Route path='/captain-profile' element={
        <CaptainProtectWrapper> <CaptainProfile/></CaptainProtectWrapper>
      }/>
      
      <Route path='/captain-logout' element={
        <CaptainProtectWrapper> <CaptainLoggedOut/></CaptainProtectWrapper>
      }/>
      <Route path='/riding' element={
        <UserProtectWrapper> <Riding/></UserProtectWrapper>
      }/>
      <Route path='/captain-riding' element={
        <CaptainProtectWrapper> <CaptainRiding/></CaptainProtectWrapper>

      }/>

    </Routes>
    </>
    
  )
}

export default App;