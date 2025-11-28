import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';
import authStore from '../../stores/authStore';
import Input from '../UI/Input';
import Button from '../UI/Button';
import './Auth.css';

const Login = observer(() => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
  });

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await authStore.login(formData.username, formData.password);
    if (authStore.isAuthenticated) {
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>

        <form onSubmit={handleSubmit} className="auth-form">
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
            Sign In
          </Button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
});

export default Login;