import { Link } from "react-router-dom";
import WishlistButton from "./WishlistButton";
import { resolveMediaUrl } from "../utils/media";

function PropertyCard({ property }) {
  return (
    <article className="property-card glass-card">
      <div className="property-card-image">
        <img
          src={resolveMediaUrl(property.images?.[0]?.image)}
          alt={property.title}
        />
        <span className="property-badge">{property.listing_type}</span>
      </div>

      <div className="property-info">
        <h3>{property.title}</h3>
        <p className="price-tag">
          ₹ {Number(property.price).toLocaleString("en-IN")}
        </p>
        <p className="muted">
          {property.city}, {property.state}
        </p>
        <p className="property-meta">
          {property.bedrooms} beds · {property.bathrooms} baths ·{" "}
          {property.property_type}
        </p>

        <div className="property-card-actions">
          <WishlistButton propertyId={property.id} />
          <Link to={`/property/${property.id}`} className="btn btn-primary btn-sm">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
