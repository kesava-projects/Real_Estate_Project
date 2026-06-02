import api from "./api";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access")}`
  }
});

export const createContactRequest = (data) => {
  return api.post(
    "/contacts/",
    data,
    getAuthHeader()
  );
};

export const getMyContacts = () => {
  return api.get(
    "/contacts/",
    getAuthHeader()
  );
};

export const deleteContact = (id) => {
  return api.delete(
    `/contacts/${id}/`,
    getAuthHeader()
  );
};