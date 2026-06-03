import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import {
  notifyAuthStateChanged,
  login,
  googleLogin,
  fetchCurrentUser,
  saveUserProfile,
} from "../services/authService";
import { notifySuccess, notifyError } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const persistSession = async (tokenData) => {
    localStorage.setItem("access", tokenData.access);
    localStorage.setItem("refresh", tokenData.refresh);
    notifyAuthStateChanged();
    if (tokenData.user) {
      saveUserProfile(tokenData.user);
    } else {
      await fetchCurrentUser();
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await login(data);
      await persistSession(response.data);
      notifySuccess("Welcome back!");
      const redirect = location.state?.from?.pathname || "/properties";
      navigate(redirect);
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Invalid credentials"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleLogin(tokenResponse.access_token);
        await persistSession(res.data);
        notifySuccess("Google sign-in successful");
        navigate("/properties");
      } catch (err) {
        notifyError(getApiErrorMessage(err, "Google login failed"));
      }
    },
    onError: () => notifyError("Google login failed"),
  });

  return (
    <div className="auth-page">
      <form className="glass-card auth-card" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className="auth-subtitle">
          Sign in to save homes and contact agents
        </p>

        <div className="form-grid">
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <p className="auth-link-row">
          <Link to="/forgot-password" className="link-btn">
            Forgot password?
          </Link>
        </p>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <button
          type="button"
          onClick={() => handleGoogleLogin()}
          className="google-btn"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt=""
            width={18}
          />
          Sign in with Google
        </button>

        <p className="auth-footer">
          New here?{" "}
          <Link to="/register" className="link-btn">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
