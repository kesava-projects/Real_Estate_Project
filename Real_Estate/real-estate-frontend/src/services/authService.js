import api from "./api";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  },
});

export const saveUserProfile = (user) => {
  if (!user) {
    return;
  }
  localStorage.setItem("user", JSON.stringify(user));
};

export const getStoredUser = () => {
  const raw = localStorage.getItem("user");
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getStoredRole = () => getStoredUser()?.role ?? null;

export const clearUserProfile = () => {
  localStorage.removeItem("user");
};

export const fetchCurrentUser = async () => {
  const response = await api.get("/accounts/me/", getAuthHeader());
  saveUserProfile(response.data);
  return response.data;
};
