import api from "./api";

export const getProperties = (params = {}) =>
  api.get("/properties/listings/", { params });

export const getProperty = (id) => api.get(`/properties/listings/${id}/`);

export const createProperty = (data) =>
  api.post("/properties/listings/", data);

export const updateProperty = (id, data) =>
  api.put(`/properties/listings/${id}/`, data);

export const patchProperty = (id, data) =>
  api.patch(`/properties/listings/${id}/`, data);

export const deleteProperty = (id) =>
  api.delete(`/properties/listings/${id}/`);
