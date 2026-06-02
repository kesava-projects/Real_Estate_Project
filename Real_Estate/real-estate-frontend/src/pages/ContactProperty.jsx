import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createContactRequest } from "../services/contactService";
import { getStoredRole } from "../services/authService";

function ContactProperty({ propertyId }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const role = getStoredRole();
  const token = localStorage.getItem("access");

  if (role && role !== "BUYER") {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please log in as a buyer to contact the agent.");
      navigate("/login");
      return;
    }

    try {
      await createContactRequest({
        property: propertyId,
        message,
      });

      alert("Request sent successfully. The listing agent will see it in their inbox.");

      setMessage("");
    } catch (error) {
      const detail =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Unable to send request";
      alert(typeof detail === "string" ? detail : "Unable to send request");
    }
  };

  return (
    <div className="contact-form-card">
      <h3>Contact Agent</h3>

      {!token && (
        <p className="contact-login-hint">
          Log in with a buyer account to send a message to this property&apos;s agent.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={!token}
        />

        <button type="submit" disabled={!token}>
          Send Request
        </button>
      </form>
    </div>
  );
}

export default ContactProperty;
