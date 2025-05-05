import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faHome, faTasks, faChartBar } from '@fortawesome/free-solid-svg-icons';
import Avatar from '../Avatar/Avatar';


const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Kullanıcı durumunu kontrol et
  useEffect(() => {
    checkUserAuth();
  }, []);

  // Kullanıcı kimlik doğrulama durumunu kontrol eden fonksiyon
const checkUserAuth = () => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  } catch (error) {
    console.error("localStorage'dan kullanıcı bilgisi alınırken hata:", error);
    setUser(null);
  }
};

  const handleLogout = () => {
    // Çıkış yap: localStorage'dan kullanıcı bilgilerini sil
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Kullanıcı durumunu güncelle
    setUser(null);
    
    // Dropdown'ı kapat
    setShowDropdown(false);
    
    // Anasayfaya yönlendir
    navigate('/');
    
    // Sayfayı yeniden yükle (bu butonların hemen güncellenmesini sağlar)
    window.location.reload();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          PMS Pro
        </Link>
        
        <div className="nav-menu">
          <div className="nav-item">
            <Link to="/" className="nav-links">
              <FontAwesomeIcon icon={faHome} className="nav-icon" />
              <span className="nav-text">Ana Sayfa</span>
            </Link>
          </div>
          
          {user ? (
            // Kullanıcı giriş yapmışsa
            <div className="nav-right">
              {/* Dashboard linki */}
              <div className="nav-item">
                <Link to="/dashboard" className="nav-links">
                  <FontAwesomeIcon icon={faChartBar} className="nav-icon" />
                  <span className="nav-text">Dashboard</span>
                </Link>
              </div>
              
              {/* Kullanıcı profili dropdown */}
              <div className="nav-item user-profile">
                <div className="profile-button" onClick={toggleDropdown}>
                  <Avatar 
                    firstName={user.firstName}
                    lastName={user.lastName}
                    size="small"
                    className="avatar"
                  />
                  <span className="user-name">{user.firstName}</span>
                </div>
                
                {/* Dropdown Menü */}
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                      <FontAwesomeIcon icon={faUser} className="dropdown-icon" />
                      Profilim
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item">
                      <FontAwesomeIcon icon={faSignOutAlt} className="dropdown-icon" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Kullanıcı giriş yapmamışsa
            <div className="nav-right">
              <div className="nav-item">
                <Link to="/login" className="nav-button login-button">
                  Giriş
                </Link>
              </div>
              <div className="nav-item">
                <Link to="/signup" className="nav-button signup-button">
                  Kayıt Ol
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;