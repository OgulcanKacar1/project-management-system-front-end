import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(''); // Başarılı giriş mesajı

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
    
    // Başarı ve hata mesajlarını temizle
    if (loginError) setLoginError('');
    if (loginSuccess) setLoginSuccess('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta adresi gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setLoginError('');
      setLoginSuccess('');
      
      try {
        const response = await axios.post('http://localhost:8080/users/login', {
          email: formData.email,
          password: formData.password
        });

        console.log('Giriş başarılı:', response.data);
        
        // Token ve kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Başarılı giriş mesajını göster
        setLoginSuccess(response.data.message || 'Giriş başarılı! Yönlendiriliyorsunuz...');
        
        // 2 saniye sonra dashboard'a yönlendir
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error) {
        if (error.response) {
          setLoginError(error.response.data.message || 'Giriş başarısız oldu');
        } else {
          setLoginError('Sunucuya bağlanırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-card'>
        <h1 className='login-title'>Giriş Yap</h1>
        
        {loginError && (
          <div className="login-error-message">
            {loginError}
          </div>
        )}
        
        {loginSuccess && (
          <div className="login-success-message">
            {loginSuccess}
          </div>
        )}

        <form className='login-form' onSubmit={handleSubmit}>
          <div className='input-group'>
            <label htmlFor='email'>E-posta Adresi</label>
            <input 
              type='email' 
              id='email' 
              name='email'
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className='error-text'>{errors.email}</span>}
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
            Hesabınız yok mu? <Link to="/signup">Kayıt Ol</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;