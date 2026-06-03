import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProperty } from "../services/propertyService";
import ContactProperty from "./ContactProperty";
import ReviewSection from "../components/ReviewSection";
import WishlistButton from "../components/WishlistButton";
import LoadingSpinner from "../components/LoadingSpinner";
import { getStoredUser } from "../services/authService";
import { resolveMediaUrl } from "../utils/media";
import { notifyError } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";
import "../styles/propertiesDetail.css";

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const user = getStoredUser();
  const isOwner =
    user &&
    property &&
    (property.agent?.id === user.id || property.agent?.pk === user.id);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await getProperty(id);
      setProperty(response.data);
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to load property"));
    }
  };

  if (!property) {
    return <LoadingSpinner label="Loading property details..." />;
  }

  const mainImage = resolveMediaUrl(property.images?.[0]?.image);

  return (
    <div className="page-container details-page">
      <div className="details-hero glass-card">
        <div className="image-section">
          <img src={mainImage} alt={property.title} />
        </div>

        <div className="details-content">
          <div className="details-top-row">
            <span className="badge">{property.listing_type}</span>
            <span className="badge badge-muted">{property.property_type}</span>
            {isOwner && (
              <Link
                to={`/property/${property.id}/edit`}
                className="btn btn-primary btn-sm"
              >
                Edit listing
              </Link>
            )}
          </div>

          <h1 className="title">{property.title}</h1>
          <h2 className="price">₹ {Number(property.price).toLocaleString("en-IN")}</h2>
          <p className="desc">{property.description}</p>

          <div className="details-actions">
            <WishlistButton propertyId={property.id} />
          </div>

          <div className="info-grid">
            <div>
              <h4>Location</h4>
              <p>
                {property.city}, {property.state}
              </p>
            </div>
            <div>
              <h4>Address</h4>
              <p>{property.address}</p>
            </div>
            <div>
              <h4>Beds</h4>
              <p>{property.bedrooms}</p>
            </div>
            <div>
              <h4>Baths</h4>
              <p>{property.bathrooms}</p>
            </div>
            <div>
              <h4>Area</h4>
              <p>{property.area_sqft} sqft</p>
            </div>
            <div>
              <h4>Pincode</h4>
              <p>{property.pincode}</p>
            </div>
          </div>

          <div className="agent-card">
            <h3>Agent details</h3>
            <p>
              <b>Name:</b> {property.agent.username}
            </p>
            <p>
              <b>Email:</b> {property.agent.email}
            </p>
            {property.agent.phone && (
              <p>
                <b>Phone:</b> {property.agent.phone}
              </p>
            )}
          </div>

          <ReviewSection propertyId={property.id} />
          <ContactProperty propertyId={property.id} />
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
