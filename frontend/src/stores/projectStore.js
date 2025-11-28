import { makeAutoObservable } from 'mobx';
import api from '../services/api';

class ProjectStore {
  projects = [];
  myProjects = [];
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  *createProject(title, description, projectUrl) {
    this.isLoading = true;
    this.error = null;
    try {
      const token = localStorage.getItem('token');
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
  }

  *fetchProjects() {
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
  }

  *fetchMyProjects() {
    this.isLoading = true;
    this.error = null;
    try {
      const token = localStorage.getItem('token');
      const response = yield api.get('/projects/my', {
        params: { token: localStorage.getItem("token") }
      });
      this.myProjects = response.data;
    } catch (error) {
      this.error = this.extractErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

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