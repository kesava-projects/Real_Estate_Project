import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <GoogleOAuthProvider clientId="791310576347-jgngj0v6dt8dq10thm65ljeld7c97oj0.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
    <ToastContainer />
  </StrictMode>,
)
