import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEllipsisV, faPencilAlt, faTrash, 
  faUsers, faCalendarAlt, faUser 
} from '@fortawesome/free-solid-svg-icons';
import './ProjectCard.css';
import ConfirmModal from '../Common/Modal';

const ProjectCard = ({ project, viewMode, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };
  
  const handleMenuToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };
  
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    onEdit();
  };
  
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    setShowDeleteConfirm(true);
  };
  
  const handleConfirmDelete = () => {
    onDelete();
  };

  // Görünüm moduna göre farklı kart yapıları
  if (viewMode === 'list') {
    return (
      <>
        <Link to={`/dashboard/projects/${project.id}`} className="project-card list-view">
          <div className="project-name">
            <h3>{project.name}</h3>
          </div>
          <div className="project-description">
            <p>{project.description || "Açıklama eklenmemiş"}</p>
          </div>
          <div className="project-meta">
            <span className="project-date">
              <FontAwesomeIcon icon={faCalendarAlt} /> {formatDate(project.createdAt)}
            </span>
            <span className="project-members">
              <FontAwesomeIcon icon={faUsers} /> {project.members?.length || 0} üye
            </span>
          </div>
          <div className="project-actions">
            <button className="icon-btn" onClick={handleMenuToggle}>
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <button onClick={handleEdit}>
                  <FontAwesomeIcon icon={faPencilAlt} /> Düzenle
                </button>
                <button className="delete" onClick={handleDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} /> Sil
                </button>
              </div>
            )}
          </div>
        </Link>
        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleConfirmDelete}
          title="Projeyi Sil"
          message={`"${project.name}" projesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        />
      </>
    );
  }
  
  // Varsayılan grid görünümü
  return (
    <>
      <Link to={`/dashboard/projects/${project.id}`} className="project-card grid-view">
        <div className="card-header">
          <h3>{project.name}</h3>
          <div className="card-menu">
            <button className="icon-btn" onClick={handleMenuToggle}>
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <button onClick={handleEdit}>
                  <FontAwesomeIcon icon={faPencilAlt} /> Düzenle
                </button>
                <button className="delete" onClick={handleDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} /> Sil
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="card-body">
          <p className="card-description">{project.description || "Açıklama eklenmemiş"}</p>
        </div>
        <div className="card-footer">
          <div className="card-info">
            <span className="card-date">
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span>{formatDate(project.createdAt)}</span>
            </span>
            <span className="card-creator">
              <FontAwesomeIcon icon={faUser} />
              <span>{project.createdBy}</span>
            </span>
          </div>
          <div className="card-members">
            <FontAwesomeIcon icon={faUsers} />
            <span>{project.members?.length || 0}</span>
          </div>
        </div>
      </Link>
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Projeyi Sil"
        message={`"${project.name}" projesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
      />
    </>
  );
};

export default ProjectCard;