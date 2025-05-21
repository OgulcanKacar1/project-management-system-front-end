import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faTasks, faFolder, faUsers, faCog, faSignOutAlt, faBars, faTimes, faMoon, faSun
} from '@fortawesome/free-solid-svg-icons';
import './AppLayout.css';
import Avatar from '../Avatar/Avatar';

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    // Kullanıcı kontrolü
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    
    // Ekran boyutu değişikliklerini dinle
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Dark mode uygulaması
    document.body.classList.toggle('dark-mode', darkMode);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
        document.body.classList.toggle('dark-mode', newDarkMode);
    };

  if (!user) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Mobil görünümde sidebar toggle butonu */}
      <div className="mobile-header">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
        </button>
        <h1>PMS01</h1>
        <div className="theme-toggle mobile-theme-toggle" onClick={toggleDarkMode}>
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </div>
      </div>
      
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="logo">
            {collapsed ? "PMS" : "PMS01"}
          </h2>
          <button className="collapse-toggle" onClick={toggleCollapsed}>
            {collapsed ? ">" : "<"}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className={location.pathname === '/dashboard' ? 'active' : ''}>
              <a onClick={() => navigate('/dashboard')}>
                <FontAwesomeIcon icon={faHome} />
                {!collapsed && <span>Dashboard</span>}
              </a>
            </li>
            <li className={location.pathname.includes('/dashboard/projects') ? 'active' : ''}>
              <a onClick={() => navigate('/dashboard/projects')}>
                <FontAwesomeIcon icon={faFolder} />
                {!collapsed && <span>Projeler</span>}
              </a>
            </li>
            <li className={location.pathname.includes('/dashboard/tasks') ? 'active' : ''}>
              <a onClick={() => navigate('/dashboard/tasks')}>
                <FontAwesomeIcon icon={faTasks} />
                {!collapsed && <span>Görevler</span>}
              </a>
            </li>
            <li className={location.pathname.includes('/dashboard/teams') ? 'active' : ''}>
              <a onClick={() => navigate('/dashboard/teams')}>
                <FontAwesomeIcon icon={faUsers} />
                {!collapsed && <span>Takımlar</span>}
              </a>
            </li>
            <li className={location.pathname.includes('/dashboard/settings') ? 'active' : ''}>
              <a onClick={() => navigate('/dashboard/settings')}>
                <FontAwesomeIcon icon={faCog} />
                {!collapsed && <span>Ayarlar</span>}
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="theme-toggle" onClick={toggleDarkMode}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            {!collapsed && <span>{darkMode ? 'Aydınlık Mod' : 'Karanlık Mod'}</span>}
          </div>
          
          <div className="user-info" onClick={() => navigate('/profile')}>
            <Avatar 
              firstName={user.firstName}
              lastName={user.lastName}
              size="small"
            />
            {!collapsed && (
              <div className="user-details">
                <span className="user-name">{user.firstName} {user.lastName}</span>
                <span className="user-email">{user.email}</span>
              </div>
            )}
          </div>
          
          <button className="logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            {!collapsed && <span>Çıkış</span>}
          </button>
        </div>
      </aside>
      
      {/* Ana içerik alanı - ProjectsPage burada render edilecek */}
      <main className="main-content">
        <Outlet />
      </main>
      
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default AppLayout;