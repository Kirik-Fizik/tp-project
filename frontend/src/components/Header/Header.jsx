import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import authStore from '../../stores/authStore';
import './Header.css';

const Header = observer(({ onAddProject, onSignIn, onSignUp }) => {
  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="logo">
          démarrage de garage
        </Link>
        
        <nav className="nav-menu">
          <Link to="/" className="nav-item">
            <img src="/Pipe_fill.svg" alt="" className="nav-icon" />
            <span>Стартап<br/>Flow</span>
          </Link>
          
          <Link to="/analytics" className="nav-item">
            <img src="/Pipe_fill.svg" alt="" className="nav-icon" />
            <span>Аналитика</span>
          </Link>
          
          <Link to="/rules" className="nav-item">
            <img src="/Pipe_fill.svg" alt="" className="nav-icon" />
            <span>Правила</span>
          </Link>
          
          {authStore.isAuthenticated ? (
            <button className="nav-item nav-button" onClick={onAddProject}>
              <img src="/Pipe_fill.svg" alt="" className="nav-icon" />
              <span>Загрузить свой<br/>проект</span>
            </button>
          ) : (
            <button className="nav-item nav-button" onClick={onSignUp}>
              <img src="/Pipe_fill.svg" alt="" className="nav-icon" />
              <span>Загрузить свой<br/>проект</span>
            </button>
          )}
          
          <Link to="/donate" className="nav-item donate-item">
            <span className="heart-icon">♥</span>
            <span>Донаты</span>
          </Link>
        </nav>
      </div>
    </header>
  );
});

export default Header;
