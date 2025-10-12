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
import Riding from './components/Riding';

const App = () => {
  return (
    <>
     <Routes>
      <Route path='/' element={<Start/>}/>
      <Route path='/login' element={<UserLogin />}/>
      <Route path='/signup' element={<UserSignup />}/>
      <Route path='/captain-login' element={<CaptainLogin/>}/>
      <Route path='/captain-signup' element={<CaptainSignup/>}/>
      <Route path='/home' element={
        <UserProtectWrapper> <Home/></UserProtectWrapper>
      }/>
      <Route path='/logout' element={
        <UserProtectWrapper> <UserLoggedOut/></UserProtectWrapper>
      }/>
      <Route path='/captain-home' element={
        <CaptainProtectWrapper> <CaptainHome/></CaptainProtectWrapper>
      }/>
      <Route path='/captain-logout' element={
        <CaptainProtectWrapper> <CaptainLoggedOut/></CaptainProtectWrapper>
      }/>
      <Route path='/riding' element={
        <UserProtectWrapper> <Riding/></UserProtectWrapper>
      }/>

    </Routes>
    </>
    
  )
}

export default App;