import React from 'react';
import NotFoundImage from './404.png';
import './Error.css';

const Error404 = () => {
  return (
    <div className="error-container">
      <h1 className="error-heading">404 - Page Not Found</h1>
      <img className='error-image' src={NotFoundImage} alt="404 Not Found" />
    </div>
  );
};

export default Error404;
