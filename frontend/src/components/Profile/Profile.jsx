import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import authStore from '../../stores/authStore';
import './Profile.css';

const Profile = observer(() => {
  if (!authStore.isAuthenticated) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h2>Please log in to view your profile</h2>
          <Link to="/login" className="btn primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="header-content">
          <Link to="/" className="back-btn">← Back to Home</Link>
          <h1>Your Profile</h1>
          <div></div>
        </div>
      </header>

      <div className="profile-container">
        <div className="profile-info">
          <div className="info-item">
            <label>Username:</label>
            <span>{authStore.user?.username}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{authStore.user?.email}</span>
          </div>
          <div className="info-item">
            <label>Member since:</label>
            <span>{new Date(authStore.user?.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="profile-stats">
          <h2>Your Stats</h2>
          <div className="stats-grid">
            <div className="stat">
              <h3>Projects</h3>
              <p>0</p>
            </div>
            <div className="stat">
              <h3>Likes</h3>
              <p>0</p>
            </div>
            <div className="stat">
              <h3>Reviews</h3>
              <p>0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Profile;