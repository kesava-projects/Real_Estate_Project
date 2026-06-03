import { useEffect, useState } from "react";
import { getProperties } from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { notifyError } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";

const emptyFilters = {
  search: "",
  city: "",
  property_type: "",
  listing_type: "",
  price_min: "",
  price_max: "",
};

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties(emptyFilters);
  }, []);

  const loadProperties = async (params) => {
    setLoading(true);
    try {
      const query = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== "" && v != null),
      );
      const response = await getProperties(query);
      setProperties(response.data);
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to load properties"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Find Your Dream Home"
        subtitle="Browse premium listings — filter by city, type, and budget"
        badge="Explore"
      />

      <div className="content-block">
        <PropertyFilters
          filters={filters}
          onChange={setFilters}
          onSearch={() => loadProperties(filters)}
        />
      </div>

      {loading ? (
        <LoadingSpinner label="Searching properties..." />
      ) : properties.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No properties found"
          message="Try adjusting your filters or check back later for new listings."
        />
      ) : (
        <div className="property-grid stagger-children content-block">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PropertyList;
