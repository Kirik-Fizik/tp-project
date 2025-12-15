import { makeAutoObservable, flow } from 'mobx';
import api from '../services/api';

class ProjectStore {
  projects = [];
  myProjects = [];
  topProjects = [];
  analytics = null;
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  createProject = flow(function* (title, description, projectUrl) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = yield api.post('/projects/', {
        title,
        description,
        project_url: projectUrl
      }, {
        params: { token: localStorage.getItem("token") }
      });
      
      this.projects.unshift(response.data);
      this.myProjects.unshift(response.data);
      return response.data;
    } catch (error) {
      this.error = this.extractErrorMessage(error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }.bind(this));

  fetchProjects = flow(function* () {
    this.isLoading = true;
    this.error = null;
    try {
      const response = yield api.get('/projects/');
      this.projects = response.data;
    } catch (error) {
      this.error = this.extractErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }.bind(this));

  fetchMyProjects = flow(function* () {
    this.isLoading = true;
    this.error = null;
    try {
      const response = yield api.get('/projects/my', {
        params: { token: localStorage.getItem("token") }
      });
      this.myProjects = response.data;
    } catch (error) {
      this.error = this.extractErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }.bind(this));

  fetchAnalytics = flow(function* () {
    this.isLoading = true;
    this.error = null;
    try {
      const response = yield api.get('/projects/analytics/top');
      this.analytics = response.data;
      this.topProjects = response.data.top_projects;
    } catch (error) {
      this.error = this.extractErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }.bind(this));

  likeProject = flow(function* (projectId) {
    try {
      yield api.post(`/projects/${projectId}/like`, {}, {
        params: { token: localStorage.getItem("token") }
      });
      yield this.fetchProjects();
    } catch (error) {
      this.error = this.extractErrorMessage(error);
      throw error;
    }
  }.bind(this));

  unlikeProject = flow(function* (projectId) {
    try {
      yield api.delete(`/projects/${projectId}/like`, {
        params: { token: localStorage.getItem("token") }
      });
      yield this.fetchProjects();
    } catch (error) {
      this.error = this.extractErrorMessage(error);
      throw error;
    }
  }.bind(this));

  checkLiked = flow(function* (projectId) {
    try {
      const response = yield api.get(`/projects/${projectId}/liked`, {
        params: { token: localStorage.getItem("token") }
      });
      return response.data;
    } catch (error) {
      return false;
    }
  }.bind(this));

  createReview = flow(function* (projectId, content, rating) {
    try {
      const response = yield api.post(`/projects/${projectId}/review`, {
        content,
        rating
      }, {
        params: { token: localStorage.getItem("token") }
      });
      return response.data;
    } catch (error) {
      this.error = this.extractErrorMessage(error);
      throw error;
    }
  }.bind(this));

  fetchProjectReviews = flow(function* (projectId) {
    try {
      const response = yield api.get(`/projects/${projectId}/reviews`);
      return response.data;
    } catch (error) {
      this.error = this.extractErrorMessage(error);
      return [];
    }
  }.bind(this));

  extractErrorMessage(error) {
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        return detail[0]?.msg || 'Validation error';
      }
      return detail;
    }
    return error.message || 'Something went wrong';
  }
}

export default new ProjectStore();
