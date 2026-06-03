import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import PropertyForm, { getEmptyPropertyForm } from "../components/PropertyForm";
import { createProperty } from "../services/propertyService";
import { uploadPropertyImage } from "../services/imageService";
import { notifySuccess, notifyError } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";

function CreateProperty() {
  const navigate = useNavigate();
  const [data, setData] = useState(getEmptyPropertyForm());
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await createProperty(data);
      const propertyId = response.data.id;
      if (image) {
        await uploadPropertyImage(propertyId, image);
      }
      notifySuccess("Property published successfully");
      navigate(`/property/${propertyId}`);
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to create property"));
    } finally {
      setSubmitting(false);
    }
  };

  const imageSlot = (
    <div className="image-upload-section">
      <label htmlFor="property-image">Cover image</label>
      <input
        id="property-image"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setImage(file || null);
          setPreview(file ? URL.createObjectURL(file) : null);
        }}
      />
      {preview && (
        <img src={preview} alt="Preview" className="preview-image" />
      )}
    </div>
  );

  return (
    <div className="page-container">
      <PageHeader
        title="Create listing"
        subtitle="Publish a new property to the marketplace"
      />
      <PropertyForm
        data={data}
        onChange={setData}
        onSubmit={handleSubmit}
        submitLabel={submitting ? "Publishing..." : "Publish property"}
        imageSlot={imageSlot}
      />
    </div>
  );
}

export default CreateProperty;
