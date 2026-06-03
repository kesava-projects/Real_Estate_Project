import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createContactRequest } from "../services/contactService";
import { getStoredRole } from "../services/authService";
import { notifySuccess, notifyError, notifyInfo } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";

function ContactProperty({ propertyId }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const role = getStoredRole();
  const token = localStorage.getItem("access");

  if (role && role !== "BUYER") {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      notifyInfo("Please sign in as a buyer to contact the agent");
      navigate("/login");
      return;
    }

    setSubmitting(true);
    try {
      await createContactRequest({ property: propertyId, message });
      notifySuccess("Message sent! The listing agent will see it in their inbox.");
      setMessage("");
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Unable to send request"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-form-card glass-card">
      <h3>Contact agent</h3>
      {!token && (
        <p className="contact-login-hint">
          Sign in with a buyer account to message this property&apos;s agent.
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Hi, I'm interested in scheduling a visit..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={!token || submitting}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!token || submitting}
        >
          {submitting ? "Sending..." : "Send request"}
        </button>
      </form>
    </div>
  );
}

export default ContactProperty;
