import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../services/wishlistService";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { resolveMediaUrl } from "../utils/media";
import { notifySuccess, notifyError } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";

function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      setItems(res.data);
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to load wishlist"));
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    try {
      await removeFromWishlist(id);
      notifySuccess("Removed from wishlist");
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to remove item"));
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading wishlist..." />;
  }

  return (
    <div className="page-container">
      <PageHeader
        title="My Wishlist"
        subtitle="Properties you've saved for later"
      />

      {items.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="No saved properties"
          message="Browse listings and tap the heart to save homes you love."
          action={
            <Link to="/properties" className="btn btn-primary">
              Explore properties
            </Link>
          }
        />
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => (
            <article key={item.id} className="wishlist-card glass-card">
              <img
                src={resolveMediaUrl(item.property_details?.images?.[0]?.image)}
                alt={item.property_details?.title}
              />
              <div className="wishlist-card-body">
                <h3>{item.property_details?.title}</h3>
                <p className="price-tag">
                  ₹ {Number(item.property_details?.price).toLocaleString("en-IN")}
                </p>
                <div className="btn-group">
                  <Link
                    to={`/property/${item.property}`}
                    className="btn btn-primary btn-sm"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
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

export default Wishlist;
