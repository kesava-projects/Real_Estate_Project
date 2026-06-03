import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { notifySuccess, notifyError } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "BUYER",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(formData);
      notifySuccess("Account created! Please sign in.");
      navigate("/login");
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Registration failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="glass-card auth-card" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        <p className="auth-subtitle">Join as a buyer or list properties as an agent</p>

        <div className="form-grid">
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
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
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91..."
            />
          </div>
          <div>
            <label htmlFor="role">I am a</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="BUYER">Buyer</option>
              <option value="AGENT">Agent</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Creating..." : "Register"}
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="link-btn">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
