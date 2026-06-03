import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../services/authService";
import { notifySuccess, notifyError } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await requestPasswordReset(email);
      notifySuccess("If that email exists, a reset link has been sent.");
      setEmail("");
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Could not send reset email"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card auth-card">
        <h2>Forgot password</h2>
        <p className="auth-subtitle">
          Enter your email to receive a password reset link
        </p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Sending..." : "Send reset link"}
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

export default ForgotPassword;
