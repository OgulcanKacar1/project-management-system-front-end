import React from 'react';
import PropTypes from 'prop-types';
import './Avatar.css';

const Avatar = ({ firstName, lastName, size = 'medium', className = '' }) => {
  // İlk harfleri alma fonksiyonu
  const getInitials = () => {
    let initials = '';
    
    if (firstName && firstName.length > 0) {
      initials += firstName.charAt(0).toUpperCase();
    }
    
    if (lastName && lastName.length > 0) {
      initials += lastName.charAt(0).toUpperCase();
    }
    
    return initials || '?';
  };

  // Boyut sınıfını belirleme
  const sizeClass = `avatar-${size}`;
  
  return (
    <div className={`avatar ${sizeClass} ${className}`}>
      <span className="avatar-text">{getInitials()}</span>
    </div>
  );
};

// PropTypes tanımlamaları
Avatar.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string
};

export default Avatar;