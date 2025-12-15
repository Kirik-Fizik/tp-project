import React from 'react';

const Button = ({ children, loading, ...props }) => {
  return (
    <button disabled={loading} {...props}>
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;