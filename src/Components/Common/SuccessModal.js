import React from 'react';
import './Modal.css'; // Mevcut CSS'i kullanıyoruz
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const SuccessModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirm-modal success-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="success-icon">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <h2>{title || 'Başarılı'}</h2>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button 
            className="btn btn-primary" 
            onClick={onClose}
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;