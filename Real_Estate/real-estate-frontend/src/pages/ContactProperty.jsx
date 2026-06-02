import { useState } from "react";
import { createContactRequest } from "../services/contactService";

function ContactProperty({ propertyId }) {

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createContactRequest({
        property: propertyId,
        message
      });

      alert("Request Sent Successfully");

      setMessage("");

    } catch (error) {

      alert("Unable to send request");

    }
  };

  return (

    <div className="contact-form-card">

      <h3>Contact Agent</h3>

      <form onSubmit={handleSubmit}>

        <textarea
          placeholder="Write your message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
        />

        <button type="submit">
          Send Request
        </button>

      </form>

    </div>
  );
}

export default ContactProperty;