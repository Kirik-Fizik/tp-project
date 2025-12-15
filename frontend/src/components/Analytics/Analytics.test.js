import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Analytics from './Analytics';
import projectStore from '../../stores/projectStore';

jest.mock('../../stores/projectStore', () => ({
  __esModule: true,
  default: {
    fetchAnalytics: jest.fn(),
    analytics: null,
    topProjects: [],
    isLoading: false
  }
}));

jest.mock('@amcharts/amcharts5', () => ({
  Root: {
    new: jest.fn(() => ({
      setThemes: jest.fn(),
      container: {
        children: {
          push: jest.fn(() => ({
            yAxes: { push: jest.fn(() => ({ get: jest.fn(() => ({ labels: { template: { setAll: jest.fn() } } })), data: { setAll: jest.fn() } })) },
            xAxes: { push: jest.fn(() => ({})) },
            series: { push: jest.fn(() => ({ columns: { template: { setAll: jest.fn(), adapters: { add: jest.fn() } }, indexOf: jest.fn() }, data: { setAll: jest.fn() }, appear: jest.fn() })) },
            get: jest.fn(() => ({ getIndex: jest.fn() })),
            appear: jest.fn(),
            children: { push: jest.fn(() => ({ data: { setAll: jest.fn() } })) }
          }))
        }
      },
      verticalLayout: {},
      dispose: jest.fn()
    }))
  },
  color: jest.fn(),
  percent: jest.fn(),
  Tooltip: {
    new: jest.fn(() => ({}))
  },
  Legend: {
    new: jest.fn(() => ({ data: { setAll: jest.fn() } }))
  }
}));

jest.mock('@amcharts/amcharts5/xy', () => ({
  XYChart: { new: jest.fn() },
  CategoryAxis: { new: jest.fn() },
  ValueAxis: { new: jest.fn() },
  AxisRendererY: { new: jest.fn() },
  AxisRendererX: { new: jest.fn() },
  ColumnSeries: { new: jest.fn() }
}));

jest.mock('@amcharts/amcharts5/percent', () => ({
  PieChart: { new: jest.fn() },
  PieSeries: { new: jest.fn() }
}));

jest.mock('@amcharts/amcharts5/themes/Animated', () => ({
  __esModule: true,
  default: { new: jest.fn() }
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Analytics Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    projectStore.isLoading = true;
    projectStore.analytics = null;
    projectStore.topProjects = [];

    renderWithRouter(<Analytics />);
    
    expect(screen.getByText('Loading analytics...')).toBeInTheDocument();
  });

  test('renders analytics header', () => {
    projectStore.isLoading = false;
    projectStore.analytics = {
      total_projects: 5,
      total_likes: 20,
      total_reviews: 10
    };
    projectStore.topProjects = [];

    renderWithRouter(<Analytics />);
    
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('← Back to Home')).toBeInTheDocument();
  });

  test('renders platform overview with stats', () => {
    projectStore.isLoading = false;
    projectStore.analytics = {
      total_projects: 5,
      total_likes: 20,
      total_reviews: 10
    };
    projectStore.topProjects = [];

    renderWithRouter(<Analytics />);
    
    expect(screen.getByText('Platform Overview')).toBeInTheDocument();
    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('Total Likes')).toBeInTheDocument();
    expect(screen.getByText('Total Reviews')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  test('renders no projects message when empty', () => {
    projectStore.isLoading = false;
    projectStore.analytics = {
      total_projects: 0,
      total_likes: 0,
      total_reviews: 0
    };
    projectStore.topProjects = [];

    renderWithRouter(<Analytics />);
    
    const noProjectMessages = screen.getAllByText('No projects yet');
    expect(noProjectMessages.length).toBeGreaterThan(0);
  });

  test('calls fetchAnalytics on mount', () => {
    projectStore.isLoading = false;
    projectStore.analytics = null;
    projectStore.topProjects = [];

    renderWithRouter(<Analytics />);
    
    expect(projectStore.fetchAnalytics).toHaveBeenCalled();
  });

  test('renders detailed project statistics section', () => {
    projectStore.isLoading = false;
    projectStore.analytics = {
      total_projects: 1,
      total_likes: 5,
      total_reviews: 2
    };
    projectStore.topProjects = [{
      id: 1,
      title: 'Test Project',
      username: 'testuser',
      likes_count: 5,
      reviews_count: 2
    }];

    renderWithRouter(<Analytics />);
    
    expect(screen.getByText('Detailed Project Statistics')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });
});
