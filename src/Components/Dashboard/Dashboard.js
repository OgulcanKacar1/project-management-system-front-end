import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFolder, faTasks, faUsers, faCheckCircle, 
  faExclamationCircle, faCalendarAlt, faProjectDiagram
} from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    pendingTasks: 0,
    teamMembers: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Projeleri getir
      const projectsResponse = await axios.get('http://localhost:8080/api/projects/my-projects', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Son 5 projeyi al
      const recent = projectsResponse.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 5);
      
      setRecentProjects(recent);
      
      // Temel istatistikleri hesapla
      setStats({
        totalProjects: projectsResponse.data.length,
        completedProjects: projectsResponse.data.filter(p => p.status === 'COMPLETED').length,
        totalTasks: 0, // API henüz hazır değil
        pendingTasks: 0, // API henüz hazır değil
        teamMembers: [...new Set(projectsResponse.data.flatMap(p => p.members?.map(m => m.email) || []))].length
      });
      
      // Not: Görev ve takım üyeleri için daha fazla API çağrısı eklenebilir
      
    } catch (error) {
      console.error('Dashboard verileri getirilirken hata:', error);
      setError('Dashboard verileri yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-spinner"></div>
        <p>Dashboard yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      {/* İstatistik Kartları */}
      <div className="stats-cards">
        <div className="stat-card" onClick={() => navigate('/projects')}>
          <div className="stat-icon project-icon">
            <FontAwesomeIcon icon={faFolder} />
          </div>
          <div className="stat-details">
            <h3>Toplam Projeler</h3>
            <p className="stat-count">{stats.totalProjects}</p>
          </div>
        </div>
        
        <div className="stat-card" onClick={() => navigate('/projects?status=completed')}>
          <div className="stat-icon completed-icon">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <div className="stat-details">
            <h3>Tamamlanan Projeler</h3>
            <p className="stat-count">{stats.completedProjects}</p>
          </div>
        </div>
        
        <div className="stat-card" onClick={() => navigate('/tasks')}>
          <div className="stat-icon task-icon">
            <FontAwesomeIcon icon={faTasks} />
          </div>
          <div className="stat-details">
            <h3>Toplam Görevler</h3>
            <p className="stat-count">{stats.totalTasks}</p>
          </div>
        </div>
        
        <div className="stat-card" onClick={() => navigate('/tasks?status=pending')}>
          <div className="stat-icon pending-icon">
            <FontAwesomeIcon icon={faExclamationCircle} />
          </div>
          <div className="stat-details">
            <h3>Bekleyen Görevler</h3>
            <p className="stat-count">{stats.pendingTasks}</p>
          </div>
        </div>
        
        <div className="stat-card" onClick={() => navigate('/teams')}>
          <div className="stat-icon team-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="stat-details">
            <h3>Takım Üyeleri</h3>
            <p className="stat-count">{stats.teamMembers}</p>
          </div>
        </div>
      </div>
      
      {/* Son Projeler */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>
            <FontAwesomeIcon icon={faProjectDiagram} /> Son Projeler
          </h2>
          <button className="btn btn-text" onClick={() => navigate('/dashboard/projects')}>
            Tümünü Gör
          </button>
        </div>
        
        <div className="recent-projects">
          {recentProjects.length === 0 ? (
            <div className="empty-state">
              <p>Henüz proje yok.</p>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/projects/new')}
              >
                Yeni Proje Oluştur
              </button>
            </div>
          ) : (
            <div className="projects-list">
              {recentProjects.map(project => (
                <div 
                  key={project.id} 
                  className="recent-project-item"
                  onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                >
                  <div className="project-details">
                    <h3>{project.name}</h3>
                    <p>{project.description ? project.description.substring(0, 100) : 'Açıklama yok'}</p>
                  </div>
                  <div className="project-meta">
                    <div className="project-date">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      {new Date(project.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                    <div className="project-members">
                      <FontAwesomeIcon icon={faUsers} />
                      {project.members?.length || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Buraya aktiviteler, takvim veya diğer dashboard bileşenleri eklenebilir */}
    </div>
  );
};

export default Dashboard;