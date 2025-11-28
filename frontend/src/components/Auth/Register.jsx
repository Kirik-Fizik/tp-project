import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';
import authStore from '../../stores/authStore';
import Input from '../UI/Input';
import Button from '../UI/Button';
import './Auth.css';

const Register = observer(() => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: '',
    username: '',
    password: '',
  });

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authStore.register(formData.email, formData.username, formData.password);
      await authStore.login(formData.username, formData.password);
      if (authStore.isAuthenticated) {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h2>Join Startup Flow</h2>
        <p>Create your account to get started</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            required
          />
          
          <Input
            label="Username"
            value={formData.username}
            onChange={handleChange('username')}
            required
          />
          
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            required
          />

          {authStore.error && <div className="error-message">{authStore.error}</div>}

          <Button type="submit" loading={authStore.isLoading}>
            Create Account
          </Button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
});

export default Register;