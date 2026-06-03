import { useEffect, useState } from "react";
import {
  getReviews,
  createReview,
  patchReview,
  deleteReview,
} from "../services/reviewService";
import { getStoredUser } from "../services/authService";
import { notifySuccess, notifyError } from "../utils/toast";
import { getApiErrorMessage } from "../utils/apiError";
import "../styles/reviews.css";

function ReviewSection({ propertyId }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: "", property: propertyId });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });
  const token = localStorage.getItem("access");
  const user = getStoredUser();

  useEffect(() => {
    fetchReviews();
    setForm((f) => ({ ...f, property: propertyId }));
  }, [propertyId]);

  const fetchReviews = async () => {
    try {
      const res = await getReviews(propertyId);
      setReviews(res.data);
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to load reviews"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview(form);
      notifySuccess("Review posted");
      setForm({ rating: 5, comment: "", property: propertyId });
      fetchReviews();
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Could not post review"));
    }
  };

  const startEdit = (review) => {
    setEditingId(review.id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const saveEdit = async (id) => {
    try {
      await patchReview(id, {
        rating: Number(editForm.rating),
        comment: editForm.comment,
      });
      notifySuccess("Review updated");
      setEditingId(null);
      fetchReviews();
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to update review"));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      notifySuccess("Review deleted");
      fetchReviews();
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Failed to delete review"));
    }
  };

  const isOwnReview = (review) =>
    user && (review.user === user.id || review.user_username === user.username);

  return (
    <div className="review-container">
      <h2>Reviews</h2>

      {token && (
        <form className="review-form glass-card" onSubmit={handleSubmit}>
          <label htmlFor="rating">Your rating</label>
          <select
            id="rating"
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: Number(e.target.value) })
            }
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {"⭐".repeat(n)} ({n})
              </option>
            ))}
          </select>
          <textarea
            placeholder="Share your experience with this property..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Post review
          </button>
        </form>
      )}

      <div className="review-list">
        {reviews.length === 0 ? (
          <p className="muted">No reviews yet — be the first!</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="review-card glass-card">
              {editingId === r.id ? (
                <div className="review-edit-form">
                  <select
                    value={editForm.rating}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        rating: Number(e.target.value),
                      })
                    }
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} stars
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={editForm.comment}
                    onChange={(e) =>
                      setEditForm({ ...editForm, comment: e.target.value })
                    }
                  />
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => saveEdit(r.id)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="review-header">
                    <b>{r.user_username}</b>
                    <span>{"⭐".repeat(r.rating)}</span>
                  </div>
                  <p>{r.comment}</p>
                  {isOwnReview(r) && (
                    <div className="review-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => startEdit(r)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewSection;
