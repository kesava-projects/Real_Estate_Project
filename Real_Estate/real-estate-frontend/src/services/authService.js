import api from "./api";

export const AUTH_STATE_EVENT = "auth-state-changed";

export const notifyAuthStateChanged = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_STATE_EVENT));
};

export const saveUserProfile = (user) => {
  if (!user) return;
  const normalized = {
    ...user,
    id: user.id ?? user.pk,
  };
  localStorage.setItem("user", JSON.stringify(normalized));
  notifyAuthStateChanged();
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getStoredRole = () => getStoredUser()?.role ?? null;

export const clearUserProfile = () => {
  localStorage.removeItem("user");
  notifyAuthStateChanged();
};

export const register = (data) => api.post("/accounts/register/", data);

export const login = (data) => api.post("/accounts/login/", data);

export const googleLogin = (accessToken) =>
  api.post("/accounts/google/login/", { access_token: accessToken });

export const refreshToken = (refresh) =>
  api.post("/accounts/refresh/", { refresh });

export const fetchCurrentUser = async () => {
  const response = await api.get("/accounts/me/");
  saveUserProfile(response.data);
  return response.data;
};

export const getUserDetails = () => api.get("/accounts/user/");

export const updateUserDetails = (data) => api.put("/accounts/user/", data);

export const patchUserDetails = (data) => api.patch("/accounts/user/", data);

export const changePassword = (data) =>
  api.post("/accounts/password/change/", data);

export const requestPasswordReset = (email) =>
  api.post("/accounts/password/reset/", { email });

export const confirmPasswordReset = (data) =>
  api.post("/accounts/password/reset/confirm/", data);

export const logout = () => api.post("/accounts/logout/");

export const verifyToken = () =>
  api.post("/accounts/token/verify/", {
    token: localStorage.getItem("access"),
  });
