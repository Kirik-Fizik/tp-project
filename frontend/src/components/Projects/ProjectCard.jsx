import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import authStore from '../../stores/authStore';
import projectStore from '../../stores/projectStore';
import ReviewModal from './ReviewModal';
import './ProjectCard.css';

const ProjectCard = observer(({ project, onUpdate }) => {
  const [liked, setLiked] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    if (authStore.isAuthenticated) {
      checkIfLiked();
    }
  }, [project.id, authStore.isAuthenticated]);

  const checkIfLiked = async () => {
    const isLiked = await projectStore.checkLiked(project.id);
    setLiked(isLiked);
  };

  const handleLikeToggle = async () => {
    if (!authStore.isAuthenticated) return;
    
    try {
      if (liked) {
        await projectStore.unlikeProject(project.id);
      } else {
        await projectStore.likeProject(project.id);
      }
      setLiked(!liked);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Like operation failed:', error);
    }
  };

  const loadReviews = async () => {
    const data = await projectStore.fetchProjectReviews(project.id);
    setReviews(data);
    setShowReviews(!showReviews);
  };

  const handleReviewSubmit = async () => {
    setShowReviewModal(false);
    await loadReviews();
    if (onUpdate) onUpdate();
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <h3 className="project-title">{project.title}</h3>
        <span className="project-author">by {project.username}</span>
      </div>
      
      <p className="project-description">{project.description}</p>
      
      <div className="project-stats">
        <span className="stat">
          <span className="stat-icon">❤️</span> {project.likes_count || 0} likes
        </span>
        <span className="stat">
          <span className="stat-icon">💬</span> {project.reviews_count || 0} reviews
        </span>
      </div>
      
      <div className="project-actions">
        {authStore.isAuthenticated && (
          <>
            <button 
              className={`like-btn ${liked ? 'liked' : ''}`}
              onClick={handleLikeToggle}
            >
              {liked ? '❤️ Liked' : '🤍 Like'}
            </button>
            <button 
              className="review-btn"
              onClick={() => setShowReviewModal(true)}
            >
              ✍️ Review
            </button>
          </>
        )}
        <button className="reviews-toggle" onClick={loadReviews}>
          {showReviews ? 'Hide Reviews' : 'Show Reviews'}
        </button>
      </div>
      
      <div className="project-footer">
        <a 
          href={project.project_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="project-link"
        >
          Visit Project →
        </a>
        <span className="project-date">
          {new Date(project.created_at).toLocaleDateString()}
        </span>
      </div>

      {showReviews && (
        <div className="reviews-section">
          <h4>Reviews</h4>
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <span className="review-author">{review.username}</span>
                  <span className="review-rating">
                    {'⭐'.repeat(review.rating)}
                  </span>
                </div>
                <p className="review-content">{review.content}</p>
                <span className="review-date">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        projectId={project.id}
        onSuccess={handleReviewSubmit}
      />
    </div>
  );
});

export default ProjectCard;
