import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import HomePage from './HomePage';
import projectStore from '../../stores/projectStore';
import authStore from '../../stores/authStore';

jest.mock('../../stores/projectStore', () => ({
  __esModule: true,
  default: {
    fetchProjects: jest.fn(),
    projects: []
  }
}));

jest.mock('../../stores/authStore', () => ({
  __esModule: true,
  default: {
    isAuthenticated: false,
    user: null,
    logout: jest.fn()
  }
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('HomePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authStore.isAuthenticated = false;
    authStore.user = null;
    projectStore.projects = [];
  });

  test('renders main heading', () => {
    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('Startup Flow')).toBeInTheDocument();
    expect(screen.getByText('Discover Amazing Startup Projects')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Rules')).toBeInTheDocument();
    expect(screen.getByText('Donate')).toBeInTheDocument();
  });

  test('renders login and register buttons when not authenticated', () => {
    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  test('renders action cards', () => {
    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('Top Rated')).toBeInTheDocument();
    expect(screen.getByText('Platform Rules')).toBeInTheDocument();
    expect(screen.getByText('Support Us')).toBeInTheDocument();
  });

  test('calls fetchProjects on mount', () => {
    renderWithRouter(<HomePage />);
    
    expect(projectStore.fetchProjects).toHaveBeenCalled();
  });

  test('renders empty projects message', () => {
    projectStore.projects = [];
    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('No projects yet. Be the first to share your startup!')).toBeInTheDocument();
  });

  test('renders CTA section when not authenticated', () => {
    authStore.isAuthenticated = false;
    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('Ready to join the community?')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  test('renders user section when authenticated', () => {
    authStore.isAuthenticated = true;
    authStore.user = { username: 'testuser' };
    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('Welcome, testuser!')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('renders Add Project card when authenticated', () => {
    authStore.isAuthenticated = true;
    authStore.user = { username: 'testuser' };
    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('Add Project')).toBeInTheDocument();
    expect(screen.getByText('Share your own startup with the community')).toBeInTheDocument();
  });

  test('renders projects when available', () => {
    authStore.isAuthenticated = false;
    projectStore.projects = [
      {
        id: 1,
        title: 'Test Project',
        description: 'A test project description',
        username: 'author1',
        likes_count: 10,
        reviews_count: 5,
        project_url: 'https://example.com',
        created_at: '2024-01-01T00:00:00Z'
      }
    ];
    
    renderWithRouter(<HomePage />);
    
    expect(screen.getByText('Latest Projects')).toBeInTheDocument();
  });
});
