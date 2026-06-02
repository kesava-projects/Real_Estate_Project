import { useState, useEffect } from "react";
import { addToWishlist, getWishlist } from "../services/wishlistService";
import "../styles/wishlist.css";

function WishlistButton({ propertyId }) {

  const [saved, setSaved] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (token) checkWishlist();
  }, []);

  const checkWishlist = async () => {
    try {
      const res = await getWishlist();

      const item = res.data.find(
        (w) => w.property === propertyId
      );

      if (item) {
        setSaved(true);
        setWishlistId(item.id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async () => {
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      if (!saved) {
        await addToWishlist(propertyId);
        setSaved(true);
      }
    } catch (err) {
      alert(err.response?.data?.error);
    }
  };

  return (
    <button
      className={saved ? "wishlist-btn saved" : "wishlist-btn"}
      onClick={handleClick}
    >
      {saved ? "❤️ Saved" : "🤍 Wishlist"}
    </button>
  );
}

export default WishlistButton;