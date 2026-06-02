import {
  useEffect,
  useState
} from "react";

import {
  getMyContacts,
  deleteContact
} from "../services/contactService";

import ContactCard from "../components/ContactCard";

import "../styles/contact.css";

function MyContacts() {

  const [contacts, setContacts] =
    useState([]);

  useEffect(() => {

    loadContacts();

  }, []);

  const loadContacts = async () => {

    try {

      const response =
        await getMyContacts();

      setContacts(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  const handleDelete =
    async (id) => {

    try {

      await deleteContact(id);

      setContacts(
        contacts.filter(
          (contact) =>
            contact.id !== id
        )
      );

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="contacts-page">

      <h1>
        Contact Requests
      </h1>

      {contacts.length === 0 ? (

        <h3>
          No Contact Requests
        </h3>

      ) : (

        contacts.map((contact) => (

          <ContactCard
            key={contact.id}
            contact={contact}
            onDelete={handleDelete}
          />

        ))

      )}

    </div>
  );
}

export default MyContacts;