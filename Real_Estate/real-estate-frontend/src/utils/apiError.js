export const getApiErrorMessage = (error, fallback = "Something went wrong") => {
  const data = error?.response?.data;
  if (!data) {
    return fallback;
  }
  if (typeof data === "string") {
    return data;
  }
  if (data.detail) {
    return typeof data.detail === "string"
      ? data.detail
      : JSON.stringify(data.detail);
  }
  if (data.error) {
    return typeof data.error === "string" ? data.error : fallback;
  }
  if (data.message) {
    return data.message;
  }
  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const val = data[firstKey];
    if (Array.isArray(val)) {
      return `${firstKey}: ${val[0]}`;
    }
    if (typeof val === "string") {
      return val;
    }
  }
  return fallback;
};
