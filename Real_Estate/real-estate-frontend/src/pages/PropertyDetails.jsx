import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProperty } from "../services/propertyService";
import ContactProperty from "./ContactProperty";
import "../styles/propertiesDetail.css";
import ReviewSection from "../components/ReviewSection";

function PropertyDetails() {

  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    const response = await getProperty(id);
    setProperty(response.data);
  };

  if (!property) {
    return <h2 className="loading">Loading...</h2>;
  }

  const mainImage =
    property.images?.length > 0
      ? `${property.images[0].image}`
      : "https://images.unsplash.com/photo-1568605114967-8130f3a36994";
  return (
    <div className="details-container">

      {/* IMAGE SECTION */}
      <div className="image-section">
          {console.log(mainImage)}
        <img src={mainImage} alt={property.title} />
      </div>

      {/* INFO SECTION */}
      <div className="details-content">

        <h1 className="title">{property.title}</h1>

        <h2 className="price">₹ {property.price}</h2>

        <p className="desc">{property.description}</p>

        <div className="info-grid">

          <div>
            <h4>Location</h4>
            <p>{property.city}, {property.state}</p>
          </div>

          <div>
            <h4>Address</h4>
            <p>{property.address}</p>
          </div>

          <div>
            <h4>Type</h4>
            <p>{property.property_type}</p>
          </div>

          <div>
            <h4>Listing</h4>
            <p>{property.listing_type}</p>
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


        {/* AGENT SECTION */}
        <div className="agent-card">

          <h3>Agent Details</h3>

          <p><b>Name:</b> {property.agent.username}</p>
          <p><b>Email:</b> {property.agent.email}</p>
          <p><b>Phone:</b> {property.agent.phone}</p>

        </div>

        <ReviewSection propertyId={property.id} />

        {/* CONTACT */}
        <ContactProperty propertyId={property.id} />

      </div>

    </div>
  );
}

export default PropertyDetails;