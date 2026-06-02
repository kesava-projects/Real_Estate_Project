import api from "./api";

export const getWishlist = () => {
  const token = localStorage.getItem("access");

  return api.get("/wishlist/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addToWishlist = (propertyId) => {
  const token = localStorage.getItem("access");

  return api.post(
    "/wishlist/",
    { property: propertyId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const removeFromWishlist = (id) => {
  const token = localStorage.getItem("access");

  return api.delete(`/wishlist/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};