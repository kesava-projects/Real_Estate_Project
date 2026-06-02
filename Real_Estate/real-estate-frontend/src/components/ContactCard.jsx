function ContactCard({
  contact,
  onDelete
}) {

  return (

    <div className="contact-card">

      <div className="contact-header">

        <h3>
          {contact.property_details.title}
        </h3>

        <span>
          {new Date(
            contact.created_at
          ).toLocaleDateString()}
        </span>

      </div>

      <p>
        {contact.message}
      </p>

      <div className="contact-footer">

        <p>
          Buyer:
          {contact.user_username}
        </p>

        <p>
          {contact.user_email}
        </p>

      </div>

      <button
        onClick={() =>
          onDelete(contact.id)
        }
      >
        Delete
      </button>

    </div>
  );
}

export default ContactCard;