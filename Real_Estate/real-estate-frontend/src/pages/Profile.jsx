import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  fetchCurrentUser,
  getUserDetails,
  updateUserDetails,
  saveUserProfile,
} from "../services/authService";
import { notifySuccess, notifyError } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const meRes = await fetchCurrentUser();
      let data = meRes;

      try {
        const userRes = await getUserDetails();
        data = {
          ...meRes,
          ...userRes.data,
        };
      } catch {
        // Fall back to the authenticated user payload when the profile detail endpoint is unavailable.
      }

      setForm({
        username: data.username ?? meRes.username,
        email: data.email ?? meRes.email,
        phone: data.phone ?? meRes.phone ?? "",
        role: data.role ?? meRes.role,
      });
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to load profile"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserDetails({
        username: form.username,
        phone: form.phone,
      });
      saveUserProfile({
        ...response.data,
        id: response.data.pk ?? response.data.id,
        role: form.role,
        email: form.email,
      });
      notifySuccess("Profile updated successfully");
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to update profile"));
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading profile..." />;
  }

  return (
    <div className="page-container">
      <PageHeader
        title="My Profile"
        subtitle="Manage your username and contact information"
        badge="Account"
      />

      <div className="glass-card profile-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" value={form.email} disabled />
          </div>
          <div>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91..."
            />
          </div>
          <div>
            <label htmlFor="role">Role</label>
            <input id="role" name="role" value={form.role} disabled />
          </div>

          <div className="profile-actions">
            <button type="submit" className="btn btn-primary">
              Save profile
            </button>
            <Link to="/change-password" className="btn btn-secondary">
              Change password
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
