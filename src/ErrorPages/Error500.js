// Error500.js
import React from 'react';
import ServerErrorImage from './500.webp';
import './Error.css';

const Error500 = () => {
  return (
    <div className="error-container">
      <h1 className="error-heading">500 - Internal Server Error</h1>
      <img className='error-image' src={ServerErrorImage} alt="500 Internal Server Error" />
    </div>
  );
};

export default Error500;
