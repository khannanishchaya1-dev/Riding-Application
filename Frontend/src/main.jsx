import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContext from './UserContext/UserContext.jsx'
import CaptainContext from './UserContext/CaptainContext.jsx'
import SocketProvider from "./UserContext/SocketContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
   <SocketProvider>
      <CaptainContext>
       <UserContext>
      <App/>
      </UserContext>
      </CaptainContext>
      </SocketProvider>
      </BrowserRouter>
    

  </StrictMode>
)
