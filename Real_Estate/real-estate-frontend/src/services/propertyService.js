import api from "./api";

export const getProperties = () => {
  return api.get("/properties/listings/");
};

export const getProperty = (id) => {
  return api.get(`/properties/listings/${id}/`);
};

export const createProperty = (data) => {

  const token = localStorage.getItem("access");
  return api.post(
    "/properties/listings/",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};