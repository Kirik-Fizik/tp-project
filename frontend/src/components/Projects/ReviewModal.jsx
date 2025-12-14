import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import projectStore from '../../stores/projectStore';
import Button from '../UI/Button';
import './ReviewModal.css';

const ReviewModal = observer(({ isOpen, onClose, projectId, onSuccess }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await projectStore.createReview(projectId, content, rating);
      setContent('');
      setRating(5);
      onSuccess();
    } catch (err) {
      setError(projectStore.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Write a Review</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-input">
            <label>Rating</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${rating >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Your Review</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts about this project..."
              rows="4"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <Button type="button" onClick={onClose} className="secondary">
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ReviewModal;
