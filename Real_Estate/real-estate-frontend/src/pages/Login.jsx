import { useState } from "react";
import api from "../services/api";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";

function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/accounts/login/", data);

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      toast.success("Login Successful");
      navigate("/properties");
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Invalid Credentials";
      toast.error(
        typeof message === "string" ? message : "Invalid Credentials"
      );
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        const res = await api.post("/accounts/google/login/", {
          access_token: tokenResponse.access_token,
        });

        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);

        toast.success("Google Login Successful");
        navigate("/properties");
      } catch (err) {
        console.error("Google login error:", err.response?.data);
        toast.error(err.response?.data?.error || "Google Login Failed");
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      toast.error("Google Login Failed");
    },
  });

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
        <br />
        <br />
        <button
          type="button"
          onClick={() => handleGoogleLogin()}
          className="google-btn"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            style={{ width: 18, marginRight: 8, verticalAlign: "middle" }}
          />
          Sign in with Google
        </button>
      </form>
    </div>
  );
}

export default Login;
