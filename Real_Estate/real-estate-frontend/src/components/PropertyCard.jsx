import { Link } from "react-router-dom";
import WishlistButton from "./WishlistButton";

function PropertyCard({ property }) {

  return (
    <div className="property-card">

      <img
  src={
    property.images?.length > 0
      ? `${property.images[0].image}`
      : "https://images.unsplash.com/photo-1568605114967-8130f3a36994"
  }
  alt={property.title}
/>

      <div className="property-info">

        <h3>{property.title}</h3>

        <p>
          ₹ {property.price}
        </p>

        <p>
          {property.city}, {property.state}
        </p>

        <p>
          {property.bedrooms} Beds |
          &nbsp;{property.bathrooms} Baths
        </p>

        <WishlistButton propertyId={property.id} />
        &nbsp;
        <Link
          to={`/property/${property.id}`}
          className="view-btn"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}

export default PropertyCard;