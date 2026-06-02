import { useState } from "react";
import api from "../services/api";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

function Login() {

  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post(
        "/accounts/login/",
        data
      );

      localStorage.setItem(
        "access",
        response.data.access
      );

      localStorage.setItem(
        "refresh",
        response.data.refresh
      );

      toast.success("Login Successful");
      navigate("/properties");

    } catch (error) {

      toast.error("Invalid Credentials");

    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const res = await api.post("/accounts/google/login/", {
      access_token: credentialResponse.credential
    });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    navigate("/properties");
  } catch (err) {
    console.log(err.response?.data);
  }
};

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">
          Login
        </button>
        <br />
       <br />
         <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google Login Failed")}
        />
      </form>
    </div>
  );
}

export default Login;