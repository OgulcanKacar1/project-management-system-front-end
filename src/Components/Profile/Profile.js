import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import Navbar from '../Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import Avatar from '../Avatar/Avatar';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Kullanıcı oturum açmış mı kontrol et
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      // LocalStorage'dan kullanıcı bilgilerini al
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        email: parsedUser.email || '',
        // Şifre alanlarını boş bırakıyoruz
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // API'den en güncel kullanıcı bilgilerini al (opsiyonel)
      fetchUserDetails(parsedUser.id, token);
    } catch (error) {
      console.error('Kullanıcı bilgisi çözümlenirken hata oluştu:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchUserDetails = async (userId, token) => {
    try {
      const response = await axios.get(`http://localhost:8080/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUser(response.data);
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        email: response.data.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Kullanıcı bilgileri getirilirken hata:', error);
      // API'den hata alırsak localStorage'daki bilgilerle devam ediyoruz
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const toggleEditMode = () => {
    setError('');
    setSuccessMessage('');
  
    if (editMode) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  
    setEditMode(!editMode);
  };

  const validateForm = () => {
    // Basit validasyon kontrolleri
    if (!formData.firstName.trim()) {
      setError('Ad alanı boş olamaz');
      return false;
    }
    
    if (!formData.lastName.trim()) {
      setError('Soyad alanı boş olamaz');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('E-posta alanı boş olamaz');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Geçerli bir e-posta adresi giriniz');
      return false;
    }
    
    // Şifre değiştirmek isteniyorsa
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError('Yeni şifre belirlemek için mevcut şifrenizi girmelisiniz');
        return false;
      }
      
      if (formData.newPassword.length < 6) {
        setError('Şifre en az 6 karakter olmalıdır');
        return false;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Yeni şifreler eşleşmiyor');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSuccessMessage('');
    setError('');

    // Değişiklik kontrolü - yalnızca kaydet butonuna basıldığında çalışsın
    const hasChanges = 
      formData.firstName !== user.firstName ||
      formData.lastName !== user.lastName ||
      formData.email !== user.email ||
      (formData.newPassword && formData.currentPassword);

    if (!hasChanges) {
      setError('Herhangi bir değişiklik yapmadınız.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Güncellenecek verileri hazırla
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      };
      
      // Eğer şifre güncellenecekse
      if (formData.newPassword && formData.currentPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      // API çağrısı
      const response = await axios.put(`http://localhost:8080/users/${user.id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Başarılı güncelleme işlemi
      setSuccessMessage('Profil bilgileriniz başarıyla güncellendi.');
      
      // Güncellenmiş kullanıcı bilgilerini state ve localStorage'a kaydet
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Şifre alanlarını temizle
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Edit modunu kapat
      setEditMode(false);
    } catch (error) {
      console.error('Profil güncellenirken hata oluştu:', error);
      
      if (error.response) {
        // API'den dönen hata mesajını göster
        setError(error.response.data.message || 'Profil güncellenirken bir hata oluştu.');
      } else {
        setError('Sunucu ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyin.');
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-container loading">
          <div className="loading-spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
          <Avatar 
            firstName={user.firstName}
            lastName={user.lastName}
            size="large"
            className="profile-avatar"
          />
            <h1 className="profile-title">
              {editMode ? 'Profili Düzenle' : 'Profil Bilgileri'}
            </h1>
          </div>
          

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-info">
              <div className="form-group">
                <label htmlFor="firstName">Ad</label>
                {editMode ? (
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{user.firstName}</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Soyad</label>
                {editMode ? (
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{user.lastName}</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">E-posta</label>
                {editMode ? (
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{user.email}</p>
                )}
              </div>

              {/* Hata ve başarı mesajlarını form alanlarından sonra göster */}
              {error && <div className="alert alert-error">{error}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              
              {editMode && (
                <div className="password-section">
                  <h3>Şifre Değiştir (Opsiyonel)</h3>
                  
                  <div className="form-group">
                    <label htmlFor="currentPassword">Mevcut Şifre</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="newPassword">Yeni Şifre</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Yeni Şifre Tekrar</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="profile-actions">
              {editMode ? (
                <>
                  <button type="submit" className="btn btn-save">
                    <FontAwesomeIcon icon={faSave} /> Değişiklikleri Kaydet
                  </button>
                  <button type="button" className="btn btn-cancel" onClick={toggleEditMode}>
                    <FontAwesomeIcon icon={faTimes} /> İptal
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-edit" onClick={toggleEditMode}>
                  <FontAwesomeIcon icon={faEdit} /> Profili Düzenle
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;