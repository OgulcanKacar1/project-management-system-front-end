import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faSearch, faFilter, faTasks, 
  faCalendarAlt, faList, faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import './ProjectsPage.css';
import ProjectCard from './ProjectCard';
import NewProjectModal from './NewProjectModal';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, board
  const [sortBy, setSortBy] = useState('createdAt'); // createdAt, name, status
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/projects/my-projects', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Projeler getirilirken hata oluştu:', error);
      setError('Projeler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateProject = async (projectData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/projects', projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setShowNewProjectModal(false);
      fetchProjects();
    } catch (error) {
      console.error('Proje oluşturulurken hata:', error);
      setError('Proje oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };
  
  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowNewProjectModal(true);
  };
  
  const handleUpdateProject = async (projectData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/projects/${selectedProject.id}`, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setShowNewProjectModal(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Proje güncellenirken hata:', error);
      setError('Proje güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };
  
  const handleDeleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setProjects(projects.filter(project => project.id !== projectId));
    } catch (error) {
      console.error('Proje silinirken hata:', error);
      setError('Proje silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };
  
  // Projeleri filtreleme ve sıralama
  const filteredProjects = projects
    .filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        case 'createdAt':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  
  if (loading) {
    return (
      <div className="page projects-page loading">
        <div className="loading-spinner"></div>
        <p>Projeler yükleniyor...</p>
      </div>
    );
  }
  
  return (
    <div className="page projects-page">
      <div className="page-header">
        <div className="page-title">
          <h1>Projeler</h1>
          <p>{filteredProjects.length} proje bulundu</p>
        </div>
        
        <div className="page-actions">
          <div className="view-toggle">
            <button 
              className={viewMode === 'grid' ? 'active' : ''} 
              onClick={() => setViewMode('grid')}
            >
              <FontAwesomeIcon icon={faLayerGroup} />
            </button>
            <button 
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              <FontAwesomeIcon icon={faList} />
            </button>
            <button 
              className={viewMode === 'board' ? 'active' : ''}
              onClick={() => setViewMode('board')}
            >
              <FontAwesomeIcon icon={faTasks} />
            </button>
          </div>
          
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Proje ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-dropdown">
            <button>
              <FontAwesomeIcon icon={faFilter} />
              <span>Sırala</span>
            </button>
            <div className="dropdown-content">
              <div 
                className={sortBy === 'createdAt' ? 'active' : ''} 
                onClick={() => setSortBy('createdAt')}
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Oluşturma Tarihi</span>
              </div>
              <div 
                className={sortBy === 'name' ? 'active' : ''} 
                onClick={() => setSortBy('name')}
              >
                <FontAwesomeIcon icon={faList} />
                <span>İsim (A-Z)</span>
              </div>
              <div 
                className={sortBy === 'status' ? 'active' : ''} 
                onClick={() => setSortBy('status')}
              >
                <FontAwesomeIcon icon={faTasks} />
                <span>Durum</span>
              </div>
            </div>
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSelectedProject(null);
              setShowNewProjectModal(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Yeni Proje</span>
          </button>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <img 
            src="/empty-projects.svg" 
            alt="Henüz proje yok"
            className="empty-illustration"
          />
          <h2>Henüz projeniz yok</h2>
          <p>İlk projenizi oluşturarak başlayın</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowNewProjectModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Yeni Proje Oluştur</span>
          </button>
        </div>
      ) : (
        <div className={`projects-${viewMode}`}>
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id}
              project={project}
              viewMode={viewMode}
              onEdit={() => handleEditProject(project)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
        </div>
      )}
      
      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => {
            setShowNewProjectModal(false);
            setSelectedProject(null);
          }}
          onSave={selectedProject ? handleUpdateProject : handleCreateProject}
          project={selectedProject}
        />
      )}
    </div>
  );
};

export default ProjectsPage;