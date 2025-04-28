import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Kullanıcı adı gereklidir';
    }
    
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      // Form başarıyla doğrulandı, giriş işlemi başlatılabilir
      setIsSubmitting(true);
      
      // API çağrısı simülasyonu
      setTimeout(() => {
        console.log('Giriş yapılıyor:', formData);
        setIsSubmitting(false);
        alert('Giriş başarılı!');
        // Başarılı giriş sonrası yönlendirme yapılabilir
        // window.location.href = '/dashboard';
      }, 1500);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-card'>
        <h1 className='login-title'>Giriş Yap</h1>
        <form className='login-form' onSubmit={handleSubmit}>
          <div className='input-group'>
            <label htmlFor='username'>Kullanıcı Adı</label>
            <input 
              type='text' 
              id='username' 
              name='username'
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className='error-text'>{errors.username}</span>}
          </div>
          
          <div className='input-group'>
            <label htmlFor='password'>Şifre</label>
            <input 
              type='password' 
              id='password' 
              name='password'
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className='error-text'>{errors.password}</span>}
          </div>
          
          <div className='login-options'>
            <div className='remember-me'>
            <input 
                type='checkbox' 
                id='rememberMe' 
                name='rememberMe'
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor='rememberMe'>Beni hatırla</label>

            </div>
            <a href='#' className='forgot-password'>Şifremi unuttum</a>
          </div>
          
          <button 
            type='submit' 
            className='login-button'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
          
          <div className='signup-link'>
            Hesabınız yok mu? <Link to={{pathname: '/signup'}}>Kayıt Ol</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;