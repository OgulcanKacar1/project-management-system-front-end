import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './NewProjectModal.css';

const NewProjectModal = ({ onClose, onSave, project }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || ''
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Input değişiminde ilgili hatayı temizle
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Proje adı gereklidir';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Proje adı en az 3 karakter olmalıdır';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Açıklama 500 karakterden uzun olamaz';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      try {
        await onSave(formData);
      } catch (error) {
        console.error('Form gönderilirken hata:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => {
      // Sadece backdrop'a tıklandığında kapan
      if (e.target.className === 'modal-backdrop') onClose();
    }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{project ? 'Projeyi Düzenle' : 'Yeni Proje'}</h2>
          <button type="button" className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Proje Adı<span className="required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Proje adını girin"
              className={errors.name ? 'error' : ''}
              autoFocus
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Proje açıklamasını girin"
              rows="4"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <div className="error-text">{errors.description}</div>}
            <small className="char-count">{formData.description?.length || 0}/500</small>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-cancel" 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              İptal
            </button>
            <button 
              type="submit" 
              className="btn btn-save" 
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? 'İşleniyor...' 
                : project ? 'Güncelle' : 'Oluştur'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;