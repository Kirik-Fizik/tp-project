import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import Input from '../UI/Input';
import Button from '../UI/Button';

const AuthForm = observer(({ isLogin = false, onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onSubmit(formData.username, formData.password);
    } else {
      onSubmit(formData.email, formData.username, formData.password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      
      {!isLogin && (
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          required
        />
      )}
      
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

      {error && <div className="error-message">{error}</div>}

      <Button type="submit" loading={loading}>
        {isLogin ? 'Login' : 'Register'}
      </Button>
    </form>
  );
});

export default AuthForm;