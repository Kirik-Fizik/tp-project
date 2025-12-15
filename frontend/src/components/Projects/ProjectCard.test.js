import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectCard from './ProjectCard';
import authStore from '../../stores/authStore';
import projectStore from '../../stores/projectStore';

jest.mock('../../stores/authStore', () => ({
  __esModule: true,
  default: {
    isAuthenticated: false
  }
}));

jest.mock('../../stores/projectStore', () => ({
  __esModule: true,
  default: {
    checkLiked: jest.fn().mockResolvedValue(false),
    likeProject: jest.fn().mockResolvedValue({}),
    unlikeProject: jest.fn().mockResolvedValue({}),
    fetchProjectReviews: jest.fn().mockResolvedValue([])
  }
}));

const mockProject = {
  id: 1,
  title: 'Test Project',
  description: 'A test project description',
  username: 'testuser',
  likes_count: 5,
  reviews_count: 3,
  project_url: 'https://example.com',
  created_at: '2024-01-15T10:30:00Z'
};

describe('ProjectCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authStore.isAuthenticated = false;
  });

  test('renders project title and description', () => {
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project description')).toBeInTheDocument();
  });

  test('renders project author', () => {
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.getByText('by testuser')).toBeInTheDocument();
  });

  test('renders like and review counts', () => {
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.getByText(/5 likes/)).toBeInTheDocument();
    expect(screen.getByText(/3 reviews/)).toBeInTheDocument();
  });

  test('renders project link', () => {
    render(<ProjectCard project={mockProject} />);
    
    const link = screen.getByText('Visit Project →');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  test('renders project date', () => {
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.getByText('1/15/2024')).toBeInTheDocument();
  });

  test('does not show like button when not authenticated', () => {
    authStore.isAuthenticated = false;
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.queryByText(/Like/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Review/)).not.toBeInTheDocument();
  });

  test('shows like and review buttons when authenticated', () => {
    authStore.isAuthenticated = true;
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.getByText(/Like/)).toBeInTheDocument();
    expect(screen.getByText(/Review/)).toBeInTheDocument();
  });

  test('renders show reviews button', () => {
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.getByText('Show Reviews')).toBeInTheDocument();
  });

  test('toggles reviews on button click', async () => {
    projectStore.fetchProjectReviews.mockResolvedValue([
      {
        id: 1,
        content: 'Great project!',
        rating: 5,
        username: 'reviewer1',
        created_at: '2024-01-16T12:00:00Z'
      }
    ]);

    render(<ProjectCard project={mockProject} />);
    
    const toggleButton = screen.getByText('Show Reviews');
    fireEvent.click(toggleButton);

    expect(projectStore.fetchProjectReviews).toHaveBeenCalledWith(1);
  });

  test('handles zero likes gracefully', () => {
    const projectWithZeroLikes = { ...mockProject, likes_count: 0 };
    render(<ProjectCard project={projectWithZeroLikes} />);
    
    expect(screen.getByText(/0 likes/)).toBeInTheDocument();
  });

  test('handles zero reviews gracefully', () => {
    const projectWithZeroReviews = { ...mockProject, reviews_count: 0 };
    render(<ProjectCard project={projectWithZeroReviews} />);
    
    expect(screen.getByText(/0 reviews/)).toBeInTheDocument();
  });
});
