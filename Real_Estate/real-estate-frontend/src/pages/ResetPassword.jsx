import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "../services/authService";
import { notifySuccess, notifyError } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";

function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    new_password1: "",
    new_password2: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new_password1 !== form.new_password2) {
      notifyError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      await confirmPasswordReset({
        uid,
        token,
        new_password1: form.new_password1,
        new_password2: form.new_password2,
      });
      notifySuccess("Password reset! You can log in now.");
      navigate("/login");
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Invalid or expired reset link"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card auth-card">
        <h2>Set new password</h2>
        <p className="auth-subtitle">Choose a strong password for your account</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="new_password1">New password</label>
            <input
              id="new_password1"
              type="password"
              name="new_password1"
              value={form.new_password1}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="new_password2">Confirm password</label>
            <input
              id="new_password2"
              type="password"
              name="new_password2"
              value={form.new_password2}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Reset password"}
          </button>
        </form>
        <p className="auth-footer">
          <Link to="/login" className="link-btn">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
