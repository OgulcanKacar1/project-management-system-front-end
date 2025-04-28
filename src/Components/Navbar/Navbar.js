import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          PMS Pro
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Ana Sayfa
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-links">
              Giriş
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/signup" className="nav-links">
              Kayıt
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;