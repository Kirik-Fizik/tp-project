import ProjectStore from './projectStore';

jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn()
  }
}));

import api from '../services/api';

describe('ProjectStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('extractErrorMessage', () => {
    test('extracts detail message from response', () => {
      const error = {
        response: {
          data: {
            detail: 'Error message from server'
          }
        }
      };
      
      expect(ProjectStore.extractErrorMessage(error)).toBe('Error message from server');
    });

    test('extracts first message from array detail', () => {
      const error = {
        response: {
          data: {
            detail: [{ msg: 'Validation error' }]
          }
        }
      };
      
      expect(ProjectStore.extractErrorMessage(error)).toBe('Validation error');
    });

    test('returns generic message for empty array', () => {
      const error = {
        response: {
          data: {
            detail: []
          }
        }
      };
      
      expect(ProjectStore.extractErrorMessage(error)).toBe('Validation error');
    });

    test('returns error message when no response', () => {
      const error = {
        message: 'Network Error'
      };
      
      expect(ProjectStore.extractErrorMessage(error)).toBe('Network Error');
    });

    test('returns fallback message when nothing available', () => {
      const error = {};
      
      expect(ProjectStore.extractErrorMessage(error)).toBe('Something went wrong');
    });
  });

  describe('initial state', () => {
    test('has correct initial values', () => {
      expect(ProjectStore.projects).toEqual([]);
      expect(ProjectStore.myProjects).toEqual([]);
      expect(ProjectStore.topProjects).toEqual([]);
      expect(ProjectStore.analytics).toBeNull();
      expect(ProjectStore.isLoading).toBe(false);
      expect(ProjectStore.error).toBeNull();
    });
  });
});
