import React from 'react';

const Input = ({ label, type = 'text', value, onChange, error, ...props }) => {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={error ? 'error' : ''}
        {...props}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default Input;