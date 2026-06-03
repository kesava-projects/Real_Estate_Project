import api from "./api";

export const createContactRequest = (data) => api.post("/contacts/", data);

export const getMyContacts = () => api.get("/contacts/");

export const getContact = (id) => api.get(`/contacts/${id}/`);

export const deleteContact = (id) => api.delete(`/contacts/${id}/`);

export const replyToContact = (id, data) =>
  api.post(`/contacts/${id}/reply/`, data);
