import api from "./api";

export const getWishlist = () => api.get("/wishlist/");

export const addToWishlist = (propertyId) =>
  api.post("/wishlist/", { property: propertyId });

export const removeFromWishlist = (id) => api.delete(`/wishlist/${id}/`);
