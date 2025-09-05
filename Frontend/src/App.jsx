import React from 'react'
import{Route,Routes,Link} from 'react-router-dom';
import UserLogin from './pages/UserLogin';
import Home from './pages/Home';
import UserSignup from './pages/UserSignup';
import CaptainLogin from './pages/CaptainLogin';
import CaptainSignup from './pages/CaptainSignup';

const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<UserLogin />}/>
      <Route path='/signup' element={<UserSignup />}/>
      <Route path='/captain-login' element={<CaptainLogin/>}/>
      <Route path='/captain-signup' element={<CaptainSignup/>}/>

    </Routes>
    </>
    
  )
}

export default App;