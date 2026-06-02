import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyContacts, deleteContact } from "../services/contactService";
import {
  fetchCurrentUser,
  getStoredRole,
} from "../services/authService";
import ContactCard from "../components/ContactCard";
import "../styles/contact.css";

function MyContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [role, setRole] = useState(getStoredRole());

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    const init = async () => {
      try {
        const user = await fetchCurrentUser();
        setRole(user.role);
        await loadContacts();
      } catch (error) {
        console.log(error);
      }
    };

    init();
  }, [navigate]);

  const loadContacts = async () => {
    try {
      const response = await getMyContacts();
      setContacts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContact(id);
      setContacts(contacts.filter((contact) => contact.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const isAgentView = role === "AGENT" || role === "ADMIN";
  const pageTitle = isAgentView
    ? "Buyer Inquiries"
    : "My Contact Requests";
  const emptyMessage = isAgentView
    ? "No buyer inquiries yet for your listings."
    : "No contact requests yet.";

  return (
    <div className="contacts-page">
      <h1>{pageTitle}</h1>
      {isAgentView && (
        <p className="contacts-subtitle">
          Messages from buyers about properties you listed.
        </p>
      )}

      {contacts.length === 0 ? (
        <h3>{emptyMessage}</h3>
      ) : (
        contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            viewerRole={role}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}

export default MyContacts;
