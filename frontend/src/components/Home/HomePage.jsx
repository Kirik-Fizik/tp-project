import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import authStore from '../../stores/authStore';
import projectStore from '../../stores/projectStore';
import Header from '../Header/Header';
import AddProjectModal from '../Projects/AddProjectModal';
import AuthModal from '../Auth/AuthModal';
import ProjectCard from '../Projects/ProjectCard';
import './HomePage.css';
import image from './i.webp';

const HomePage = observer(() => {
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    projectStore.fetchProjects();
  }, []);

  const handleAddProjectClick = () => {
    if (!authStore.isAuthenticated) {
      setAuthMode('register');
      setShowAuthModal(true);
      return;
    }
    setShowAddProjectModal(true);
  };

  const handleSignIn = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleSignUp = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleProjectAdded = () => {
    projectStore.fetchProjects();
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    projectStore.fetchProjects();
  };

  return (
    <div className="home-page">
      <Header 
        onAddProject={handleAddProjectClick}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />

      <main className="home-main">
        <div className="hero-section">
          <div className="hero-text">
            <div>платформа, где стартаперы могут получить фидбеки и найти первых клиентов</div>
          </div>
          
          <div className="hero-images">
            <div className="hero-image-container top-image">
              <img src={image} alt="Project preview" />
            </div>
          </div>
        </div>

        {authStore.isAuthenticated && (
          <div className="projects-section">
            <h2>Последние проекты</h2>
            <div className="projects-grid">
              {projectStore.projects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onUpdate={() => projectStore.fetchProjects()}
                />
              ))}
            </div>
            {projectStore.projects.length === 0 && (
              <div className="empty-projects">
                <p>Проектов пока нет. Будьте первым!</p>
                <button 
                  className="btn-green-outline"
                  onClick={handleAddProjectClick}
                >
                  Добавить проект
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="home-footer">
        <div className="footer-buttons">
          {authStore.isAuthenticated ? (
            <>
              <button className="btn-green-outline" onClick={() => authStore.logout()}>
                Выйти
              </button>
              <div className="footer-divider">
                <img src="/Pipe_fill.svg" alt="" className="chevron-icon" />
              </div>
              <button className="btn-green-outline" onClick={handleAddProjectClick}>
                Добавить проект
              </button>
            </>
          ) : (
            <>
              <button className="btn-green-outline" onClick={handleSignIn}>
                Sign In
              </button>
              <div className="footer-divider">
                <img src="/Pipe_fill.svg" alt="" className="chevron-icon" />
              </div>
              <button className="btn-green-outline" onClick={handleSignUp}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </footer>

      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onSuccess={handleProjectAdded}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
});

export default HomePage;
