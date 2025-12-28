import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContext from './UserContext/UserContext.jsx'
import CaptainContext from './UserContext/CaptainContext.jsx'
import SocketProvider from "./UserContext/SocketContext.jsx"
import { LoadScript } from "@react-google-maps/api"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SocketProvider>
      <CaptainContext>
        <UserContext>

          <LoadScript
            googleMapsApiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY}
            libraries={["places"]}       
          >
            <div className="glass-phone">
              <App />
            </div>
          </LoadScript>

        </UserContext>
      </CaptainContext>
    </SocketProvider>
  </BrowserRouter>
)
