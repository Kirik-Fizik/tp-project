import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import authStore from '../../stores/authStore';
import projectStore from '../../stores/projectStore';
import AddProjectModal from '../Projects/AddProjectModal';
import ProjectCard from '../Projects/ProjectCard';
import './HomePage.css';

const HomePage = observer(() => {
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  useEffect(() => {
    projectStore.fetchProjects();
  }, []);

  const handleAddProjectClick = () => {
    if (!authStore.isAuthenticated) {
      return;
    }
    setShowAddProjectModal(true);
  };

  const handleProjectAdded = () => {
    projectStore.fetchProjects();
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <h1>Startup Flow</h1>
          <div className="header-actions">
            {authStore.isAuthenticated ? (
              <div className="user-section">
                <span>Welcome, {authStore.user?.username}!</span>
                <Link to="/profile" className="btn profile-btn">Profile</Link>
                <button 
                  onClick={() => authStore.logout()}
                  className="btn logout-btn"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn login-btn">Login</Link>
                <Link to="/register" className="btn register-btn">Register</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="home-main">
        <div className="hero-section">
          <h2>Discover Amazing Startup Projects</h2>
          <p>Find innovative solutions and connect with creators</p>
        </div>

        <div className="actions-section">
          <div className="action-cards">
            <div className="action-card">
              <h3>Browse Projects</h3>
              <p>Explore the latest startup innovations</p>
              <button className="action-btn">View All Projects</button>
            </div>

            <div className="action-card">
              <h3>Top Rated</h3>
              <p>See the most popular projects</p>
              <button className="action-btn">See Rankings</button>
            </div>

            {authStore.isAuthenticated && (
              <>
                <div className="action-card">
                  <h3>Add Project</h3>
                  <p>Share your own startup with the community</p>
                  <button 
                    className="action-btn primary"
                    onClick={handleAddProjectClick}
                  >
                    Create Project
                  </button>
                </div>
                <div className="action-card">
                  <h3>Analytics</h3>
                  <p>Track your project performance</p>
                  <button className="action-btn">View Stats</button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="projects-section">
          <h2>Latest Projects</h2>
          <div className="projects-grid">
            {projectStore.projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {projectStore.projects.length === 0 && (
            <div className="empty-projects">
              <p>No projects yet. Be the first to share your startup!</p>
              {authStore.isAuthenticated && (
                <button 
                  className="btn primary"
                  onClick={handleAddProjectClick}
                >
                  Add First Project
                </button>
              )}
            </div>
          )}
        </div>

        {!authStore.isAuthenticated && (
          <div className="cta-section">
            <h3>Ready to join the community?</h3>
            <p>Register now to share your projects and connect with others</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn primary large">Get Started</Link>
              <Link to="/login" className="btn secondary large">Sign In</Link>
            </div>
          </div>
        )}
      </main>

      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onSuccess={handleProjectAdded}
      />
    </div>
  );
});

export default HomePage;