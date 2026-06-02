import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../services/wishlistService";
import { Link } from "react-router-dom";
import "../styles/wishlist.css";

function Wishlist() {

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const res = await getWishlist();
    setItems(res.data);
  };

  const removeItem = async (id) => {
    await removeFromWishlist(id);
    fetchWishlist();
  };

  return (
    <div className="wishlist-page">

      <h1>My Wishlist ❤️</h1>

      {items.length === 0 ? (
        <p className="empty">No saved properties</p>
      ) : (
        <div className="wishlist-grid">

          {items.map((item) => (
            <div key={item.id} className="wishlist-card">

              <img
                src={
                  item.property_details?.images?.[0]
                    ? `${item.property_details.images[0].image}`
                    : "https://images.unsplash.com/photo-1568605114967-8130f3a36994"
                }
                alt="property"
              />

              <h3>{item.property_details.title}</h3>

              <p>₹ {item.property_details.price}</p>

              <div className="btn-group">

                <Link
                  to={`/property/${item.property}`}
                  className="view-btn"
                >
                  View
                </Link>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Wishlist;