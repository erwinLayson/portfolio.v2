import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SplashScreen from './components/SplashScreen'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SplashScreen />
    <App />
  </StrictMode>,
)
