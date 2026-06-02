import { useEffect, useState } from "react";
import { getReviews, createReview } from "../services/reviewService";
import "../styles/reviews.css";

function ReviewSection({ propertyId }) {

  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    rating: 5,
    comment: "",
    property: propertyId
  });

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  const fetchReviews = async () => {
    const res = await getReviews(propertyId);
    setReviews(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createReview(form);
      setForm({ ...form, comment: "" });
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.error || "Error posting review");
    }
  };

  return (
    <div className="review-container">

      <h2>Reviews</h2>

      {/* FORM */}
      {token && (
        <form className="review-form" onSubmit={handleSubmit}>

          <select
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: e.target.value })
            }
          >
            <option value="5">⭐⭐⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="2">⭐⭐</option>
            <option value="1">⭐</option>
          </select>

          <textarea
            placeholder="Write your review..."
            value={form.comment}
            onChange={(e) =>
              setForm({ ...form, comment: e.target.value })
            }
          />

          <button>Submit Review</button>
        </form>
      )}

      {/* LIST */}
      <div className="review-list">

        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="review-card">

              <div className="review-header">
                <b>{r.user_username}</b>
                <span>{"⭐".repeat(r.rating)}</span>
              </div>

              <p>{r.comment}</p>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default ReviewSection;