import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addToWishlist, getWishlist } from "../services/wishlistService";
import { getStoredRole } from "../services/authService";
import { notifySuccess, notifyInfo, notifyError } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";

function WishlistButton({ propertyId }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const token = localStorage.getItem("access");
  const role = getStoredRole();
  const isBuyer = !role || role === "BUYER";

  useEffect(() => {
    if (token && isBuyer) {
      checkWishlist();
    }
  }, [propertyId, token, isBuyer]);

  const checkWishlist = async () => {
    try {
      const res = await getWishlist();
      const item = res.data.find((w) => w.property === propertyId);
      setSaved(!!item);
    } catch {
      /* ignore */
    }
  };

  if (!isBuyer) {
    return null;
  }

  const handleClick = async () => {
    if (!token) {
      notifyInfo("Sign in to save properties to your wishlist");
      navigate("/login");
      return;
    }
    if (saved) {
      notifyInfo("Already in your wishlist — open Wishlist to remove");
      return;
    }
    try {
      await addToWishlist(propertyId);
      setSaved(true);
      notifySuccess("Added to wishlist");
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Could not add to wishlist"));
    }
  };

  return (
    <button
      type="button"
      className={`btn ${saved ? "btn-secondary" : "btn-primary"} wishlist-btn`}
      onClick={handleClick}
    >
      {saved ? "❤️ Saved" : "🤍 Save to wishlist"}
    </button>
  );
}

export default WishlistButton;
