import api from "./api";

export const getReviews = (propertyId) =>
  api.get("/reviews/", { params: { property: propertyId } });

export const createReview = (data) => api.post("/reviews/", data);

export const updateReview = (id, data) => api.put(`/reviews/${id}/`, data);

export const patchReview = (id, data) => api.patch(`/reviews/${id}/`, data);

export const deleteReview = (id) => api.delete(`/reviews/${id}/`);
