import { useEffect, useState } from "react";
import { getMyContacts, deleteContact } from "../services/contactService";
import { fetchCurrentUser, getStoredRole } from "../services/authService";
import ContactCard from "../components/ContactCard";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { notifySuccess, notifyError } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";

function MyContacts() {
  const [contacts, setContacts] = useState([]);
  const [role, setRole] = useState(getStoredRole());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const user = await fetchCurrentUser();
      setRole(user.role);
      const response = await getMyContacts();
      setContacts(response.data);
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to load contacts"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContact(id);
      notifySuccess("Contact request removed");
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to delete request"));
    }
  };

  const handleReply = (id, updatedContact) => {
    setContacts((prev) =>
      prev.map((contact) => (contact.id === id ? updatedContact : contact)),
    );
  };

  const isAgentView = role === "AGENT" || role === "ADMIN";

  if (loading) {
    return <LoadingSpinner label="Loading messages..." />;
  }

  return (
    <div className="page-container">
      <PageHeader
        title={isAgentView ? "Buyer inquiries" : "My contact requests"}
        subtitle={
          isAgentView
            ? "Messages from buyers about your listings"
            : "Track messages you sent to agents"
        }
      />

      {contacts.length === 0 ? (
        <EmptyState
          icon="✉️"
          title={isAgentView ? "No inquiries yet" : "No requests yet"}
          message={
            isAgentView
              ? "When buyers contact you about a listing, messages appear here."
              : "Visit a property page and use Contact Agent to reach out."
          }
        />
      ) : (
        <div className="contacts-list">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              viewerRole={role}
              onDelete={handleDelete}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyContacts;
