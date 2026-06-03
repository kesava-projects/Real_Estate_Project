import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { getProperties, deleteProperty } from "../services/propertyService";
import { fetchCurrentUser } from "../services/authService";
import { resolveMediaUrl } from "../utils/media";
import { notifySuccess, notifyError } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";

function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const user = await fetchCurrentUser();
      const response = await getProperties();
      const mine = response.data.filter(
        (p) => p.agent?.id === user.id || p.agent?.pk === user.id,
      );
      setListings(mine);
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to load listings"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing permanently?")) return;
    try {
      await deleteProperty(id);
      notifySuccess("Listing deleted");
      setListings((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to delete listing"));
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading your listings..." />;
  }

  return (
    <div className="page-container">
      <PageHeader
        title="My Listings"
        subtitle="Manage properties you represent as an agent"
        action={
          <Link to="/create-property" className="btn btn-primary">
            + New listing
          </Link>
        }
      />

      {listings.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No listings yet"
          message="Create your first property to start receiving buyer inquiries."
          action={
            <Link to="/create-property" className="btn btn-primary">
              Create property
            </Link>
          }
        />
      ) : (
        <div className="listings-admin-grid">
          {listings.map((property) => (
            <article key={property.id} className="listing-admin-card glass-card">
              <img
                src={resolveMediaUrl(property.images?.[0]?.image)}
                alt={property.title}
              />
              <div className="listing-admin-body">
                <h3>{property.title}</h3>
                <p className="price-tag">₹ {property.price}</p>
                <p className="muted">
                  {property.city}, {property.state}
                </p>
                <div className="listing-admin-actions">
                  <Link
                    to={`/property/${property.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    View
                  </Link>
                  <Link
                    to={`/property/${property.id}/edit`}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(property.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;
