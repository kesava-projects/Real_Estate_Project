function ContactCard({ contact, viewerRole, onDelete }) {
  const agent = contact.property_details?.agent;
  const isAgentView = viewerRole === "AGENT" || viewerRole === "ADMIN";

  return (
    <div className="contact-card">
      <div className="contact-header">
        <h3>{contact.property_details?.title}</h3>
        <span>
          {new Date(contact.created_at).toLocaleDateString()}
        </span>
      </div>

      <p>{contact.message}</p>

      <div className="contact-footer">
        {isAgentView ? (
          <>
            <p>
              <b>Buyer:</b> {contact.user_username}
            </p>
            <p>{contact.user_email}</p>
            {contact.user_phone && <p>{contact.user_phone}</p>}
          </>
        ) : (
          <>
            <p>
              <b>Agent:</b> {agent?.username}
            </p>
            <p>{agent?.email}</p>
            {agent?.phone && <p>{agent?.phone}</p>}
          </>
        )}
      </div>

      <button onClick={() => onDelete(contact.id)}>Delete</button>
    </div>
  );
}

export default ContactCard;
