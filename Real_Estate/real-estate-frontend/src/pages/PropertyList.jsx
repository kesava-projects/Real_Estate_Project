import { useEffect, useState } from "react";
import { getProperties } from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";
import "../styles/property.css";

function PropertyList() {

  const [properties, setProperties] = useState([]);

  useEffect(() => {

    loadProperties();

  }, []);

  const loadProperties = async () => {

    try {

      const response =
        await getProperties();

      setProperties(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="property-container">

      <h1>Find Your Dream Home</h1>

      <div className="property-grid">

        {properties.map((property) => (

          <PropertyCard
            key={property.id}
            property={property}
          />

        ))}

      </div>

    </div>

  );
}

export default PropertyList;