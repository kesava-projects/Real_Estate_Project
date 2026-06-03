import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { changePassword } from "../services/authService";
import { notifySuccess, notifyError } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";

function ChangePassword() {
  const [form, setForm] = useState({
    old_password: "",
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
      notifyError("New passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      await changePassword(form);
      notifySuccess("Password changed successfully");
      setForm({ old_password: "", new_password1: "", new_password2: "" });
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to change password"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Change Password"
        subtitle="Securely update your password while logged in"
      />

      <div className="glass-card auth-card-inner">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="old_password">Current password</label>
            <input
              id="old_password"
              type="password"
              name="old_password"
              value={form.old_password}
              onChange={handleChange}
              required
            />
          </div>
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
            <label htmlFor="new_password2">Confirm new password</label>
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
            {submitting ? "Updating..." : "Update password"}
          </button>
          <p className="auth-footer">
            <Link to="/profile" className="link-btn">
              Back to profile
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
