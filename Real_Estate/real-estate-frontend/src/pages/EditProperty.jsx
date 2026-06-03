import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import PropertyForm, { getEmptyPropertyForm } from "../components/PropertyForm";
import {
  getProperty,
  updateProperty,
} from "../services/propertyService";
import {
  uploadPropertyImage,
  deletePropertyImage,
} from "../services/imageService";
import { resolveMediaUrl } from "../utils/media";
import { notifySuccess, notifyError } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(getEmptyPropertyForm());
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const response = await getProperty(id);
      const p = response.data;
      setData({
        title: p.title,
        description: p.description,
        price: p.price,
        property_type: p.property_type,
        listing_type: p.listing_type,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area_sqft: p.area_sqft,
        address: p.address,
        city: p.city,
        state: p.state,
        pincode: p.pincode,
      });
      setImages(p.images || []);
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to load property"));
      navigate("/my-listings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProperty(id, data);
      if (newImage) {
        await uploadPropertyImage(id, newImage);
      }
      notifySuccess("Property updated successfully");
      navigate(`/property/${id}`);
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to update property"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveImage = async (imageId) => {
    try {
      await deletePropertyImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      notifySuccess("Image removed");
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to remove image"));
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading property..." />;
  }

  const imageSlot = (
    <div className="image-upload-section">
      <label>Gallery</label>
      <div className="existing-images">
        {images.map((img) => (
          <div key={img.id} className="thumb-wrap">
            <img src={resolveMediaUrl(img.image)} alt="" />
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => handleRemoveImage(img.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setNewImage(e.target.files?.[0] || null)}
      />
      {newImage && (
        <p className="muted">New image selected: {newImage.name}</p>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <PageHeader
        title="Edit listing"
        subtitle="Update listing details and gallery photos"
        badge="Edit"
      />
      <PropertyForm
        data={data}
        onChange={setData}
        onSubmit={handleSubmit}
        submitLabel={submitting ? "Saving..." : "Save changes"}
        imageSlot={imageSlot}
      />
    </div>
  );
}

export default EditProperty;
