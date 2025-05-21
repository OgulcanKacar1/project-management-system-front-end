import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1>Sayfa Bulunamadı</h1>
        <p>Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.</p>
        
        <div className="not-found-actions">
          <Link to="/dashboard" className="btn btn-primary">
            <FontAwesomeIcon icon={faHome} />
            <span>Ana Sayfaya Dön</span>
          </Link>
          <Link to="/dashboard/projects" className="btn btn-primary">
            <FontAwesomeIcon icon={faSearch} />
            <span>Projelerime Git</span>
          </Link>
        </div>
      </div>
      
      <div className="not-found-illustration">
        <img src="/404-illustration.svg" alt="Sayfa bulunamadı" />
      </div>
    </div>
  );
};

export default NotFound;