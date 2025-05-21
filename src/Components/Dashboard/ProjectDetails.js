import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit,faSave, faTrash, faUsers, faCalendarAlt, 
  faCheckCircle, faTasks, faPlus, faChevronLeft,
  faUserPlus, faListAlt, faCog
} from '@fortawesome/free-solid-svg-icons';
import './ProjectDetails.css';
import ConfirmModal from '../Common/Modal';
import SuccessModal from '../Common/SuccessModal';

const ProjectDetails = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, tasks, members, settings
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Modal için durum eklendi
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  
  useEffect(() => {
    fetchProjectDetails();
  }, [id]);
  
  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProject(response.data);
    } catch (error) {
      console.error('Proje detayları getirilirken hata oluştu:', error);
      setError('Proje detayları yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
   const handleDeleteClick = (e) => {
    e.preventDefault();
    setShowDeleteConfirm(true); // Modal görünürlüğünü aç
  };

  const handleUpdateProject = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/projects/${id}`, 
        {
          name: project.name,
          description: project.description
        }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Başarılı güncelleme mesajı göster
      setError(''); // Önceki hataları temizle
      
      // Alert yerine modal göster
      setSuccessMessage('Proje bilgileri başarıyla güncellendi.');
      setShowSuccessModal(true);
      
      // Güncellenmiş proje bilgilerini yeniden yükle
      fetchProjectDetails();
    } catch (error) {
      console.error('Proje güncellenirken hata oluştu:', error);
      setError('Proje güncellenirken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteProject = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/dashboard/projects');
    } catch (error) {
      console.error('Proje silinirken hata:', error);
      setError('Proje silinirken bir hata oluştu.');
    }
  };
  
  if (loading) {
    return (
      <div className="page project-details-page loading">
        <div className="loading-spinner"></div>
        <p>Proje detayları yükleniyor...</p>
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div className="page project-details-page">
        <div className="alert alert-error">
          {error || 'Proje bulunamadı.'}
        </div>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/projects')}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
          <span>Projelere dön</span>
        </button>
      </div>
    );
  }
  
  return (
    <div className="page project-details-page">
      <div className="project-header">
        <div className="back-button" onClick={() => navigate('/projects')}>
          <FontAwesomeIcon icon={faChevronLeft} />
          <span>Projelere dön</span>
        </div>
        
        <div className="project-title">
          <h1>{project.name}</h1>
          <div className="project-meta">
            <span className="project-creator">
              <FontAwesomeIcon icon={faUsers} />
              Oluşturan: {project.createdBy}
            </span>
            <span className="project-date">
              <FontAwesomeIcon icon={faCalendarAlt} />
              {new Date(project.createdAt).toLocaleDateString('tr-TR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
        
        <div className="project-actions">
          <button className="btn btn-secondary" onClick={() => setActiveTab('settings')}>
            <FontAwesomeIcon icon={faEdit} />
            <span>Düzenle</span>
          </button>
          <button className="btn btn-danger" onClick={handleDeleteClick}>
            <FontAwesomeIcon icon={faTrash} />
            <span>Sil</span>
          </button>
        </div>
      </div>
      
      <div className="project-tabs">
        <div 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FontAwesomeIcon icon={faListAlt} />
          <span>Genel Bakış</span>
        </div>
        <div 
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <FontAwesomeIcon icon={faTasks} />
          <span>Görevler</span>
        </div>
        <div 
          className={`tab ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          <FontAwesomeIcon icon={faUsers} />
          <span>Üyeler</span>
        </div>
        <div 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FontAwesomeIcon icon={faCog} />
          <span>Ayarlar</span>
        </div>
      </div>
      
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="project-summary">
              <h2>Proje Açıklaması</h2>
              <p className="project-description">
                {project.description || 'Bu proje için bir açıklama bulunmuyor.'}
              </p>
            </div>
            
            <div className="project-stats">
              <div className="stat-item">
                <FontAwesomeIcon icon={faTasks} className="stat-icon" />
                <div className="stat-content">
                  <h3>Toplam Görev</h3>
                  <p>{project.taskCount || 0}</p>
                </div>
              </div>
              
              <div className="stat-item">
                <FontAwesomeIcon icon={faCheckCircle} className="stat-icon" />
                <div className="stat-content">
                  <h3>Tamamlanan</h3>
                  <p>{project.completedTaskCount || 0}</p>
                </div>
              </div>
              
              <div className="stat-item">
                <FontAwesomeIcon icon={faUsers} className="stat-icon" />
                <div className="stat-content">
                  <h3>Üyeler</h3>
                  <p>{project.members ? project.members.length : 0}</p>
                </div>
              </div>
            </div>
            
            <div className="recent-activities">
              <h2>Son Aktiviteler</h2>
              {/* Burada aktiviteler listelenecek, henüz backend'de böyle bir yapı yok */}
              <div className="empty-state">
                <p>Henüz aktivite kaydedilmemiş.</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'tasks' && (
          <div className="tasks-tab">
            <div className="tab-header">
              <h2>Görevler</h2>
              <button className="btn btn-primary">
                <FontAwesomeIcon icon={faPlus} />
                <span>Yeni Görev</span>
              </button>
            </div>
            
            {/* Burada görevler listelenecek, henüz backend'de böyle bir yapı yok */}
            <div className="empty-state">
              <p>Henüz görev oluşturulmamış.</p>
              <button className="btn btn-primary">
                <FontAwesomeIcon icon={faPlus} />
                <span>İlk Görevi Oluştur</span>
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'members' && (
          <div className="members-tab">
            <div className="tab-header">
              <h2>Proje Üyeleri</h2>
              <button className="btn btn-primary">
                <FontAwesomeIcon icon={faUserPlus} />
                <span>Üye Ekle</span>
              </button>
            </div>
            
            <div className="members-list">
              {project.members && project.members.map((member, index) => (
                <div className="member-item" key={index}>
                  <div className="member-info">
                    <div className="member-avatar">
                      {member.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="member-details">
                      <h3>{member.email}</h3>
                      <div className="member-roles">
                        {member.roles.map((role, roleIndex) => (
                          <span key={roleIndex} className="role-tag">
                            {role === "PROJECT_ADMIN" ? "Admin" : "Üye"}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="member-actions">
                    <button className="btn btn-sm btn-secondary">
                      Rolleri Düzenle
                    </button>
                    <button className="btn btn-sm btn-danger">
                      Kaldır
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="settings-tab">
            <h2>Proje Ayarları</h2>
            
            <div className="settings-form">
              <div className="form-group">
                <label>Proje Adı</label>
                <input 
                  type="text" 
                  value={project.name}
                  onChange={(e) => setProject({...project, name: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Proje Açıklaması</label>
                <textarea 
                  value={project.description || ''}
                  onChange={(e) => setProject({...project, description: e.target.value})}
                ></textarea>
              </div>

              <button className="btn btn-primary settings-save-btn"
                onClick={handleUpdateProject}>
                <FontAwesomeIcon icon={faSave} />
                <span>Değişiklikleri Kaydet</span>
              </button>
              
              <div className="danger-zone">
                <h3>Tehlikeli Bölge</h3>
                <p>Bu işlemler geri alınamaz.</p>
                
                <button 
                  className="btn btn-danger"
                  onClick={handleDeleteClick}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span>Projeyi Sil</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteProject}
        title="Projeyi Sil"
        message={`"${project?.name}" projesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
      />
    <SuccessModal
      isOpen={showSuccessModal}
      onClose={() => setShowSuccessModal(false)}
      title="Başarılı"
      message={successMessage}
    />
    </div>
    
  );
};

export default ProjectDetails;