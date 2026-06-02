import api from "./api";

export const getReviews = (propertyId) => {
  return api.get(`/reviews/?property=${propertyId}`);
};

export const createReview = (data) => {
  const token = localStorage.getItem("access");

  return api.post("/reviews/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

