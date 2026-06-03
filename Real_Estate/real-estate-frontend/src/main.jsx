import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./styles/global.css";
import "./styles/property.css";
import "./styles/contact.css";
import "./styles/wishlist.css";
import "./styles/reviews.css";
import "./styles/propertiesDetail.css";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="791310576347-jgngj0v6dt8dq10thm65ljeld7c97oj0.apps.googleusercontent.com">
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3200}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
        limit={4}
      />
    </GoogleOAuthProvider>
  </StrictMode>,
);
