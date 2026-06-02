import api from "./api";

export const uploadPropertyImage = (
  propertyId,
  imageFile
) => {

  const token = localStorage.getItem("access");

  const formData = new FormData();

  formData.append(
    "property",
    propertyId
  );

  formData.append(
    "image",
    imageFile
  );

  return api.post(
    "/properties/images/",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    }
  );
};