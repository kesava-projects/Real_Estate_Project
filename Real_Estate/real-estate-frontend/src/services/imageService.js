import api from "./api";

export const uploadPropertyImage = (propertyId, imageFile) => {
  const formData = new FormData();
  formData.append("property", propertyId);
  formData.append("image", imageFile);

  return api.post("/properties/images/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePropertyImage = (imageId) =>
  api.delete(`/properties/images/${imageId}/`);
