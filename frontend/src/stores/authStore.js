import { makeAutoObservable, flow } from 'mobx';
import api from '../services/api';

class AuthStore {
  user = null;
  token = localStorage.getItem('token');
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
    if (this.token) {
      this.getCurrentUser();
    }
  }

  register = flow(function* (email, username, password) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = yield api.post('/auth/register', { email, username, password });
      this.user = response.data;
      return response.data;
    } catch (error) {
      this.setError(error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }.bind(this));

  login = flow(function* (username, password) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = yield api.post('/auth/login', {
        username: username,
        password: password
      });

      this.token = response.data.access_token;
      localStorage.setItem('token', this.token);
      yield this.getCurrentUser();
      return response.data;
    } catch (error) {
      this.setError(error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }.bind(this));

  getCurrentUser = flow(function* () {
    if (!this.token) return;
    try {
      const response = yield api.get('/auth/me', {
        params: { token: this.token }
      });
      this.user = response.data;
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }.bind(this));

  setError(error) {
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        this.error = detail[0]?.msg || 'Validation error';
      } else {
        this.error = detail;
      }
    } else if (error.message) {
      this.error = error.message;
    } else {
      this.error = 'Something went wrong';
    }
  }

  logout() {
    this.user = null;
    this.token = null;
    this.error = null;
    localStorage.removeItem('token');
  }

  get isAuthenticated() {
    return !!this.user;
  }
}

export default new AuthStore();