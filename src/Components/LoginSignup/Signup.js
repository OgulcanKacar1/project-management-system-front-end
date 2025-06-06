import React, { useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../services/api';

const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(password);
};

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Ad gereklidir';
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Soyad gereklidir';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'E-posta gereklidir';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Geçerli bir e-posta adresi giriniz';
        }

        if (!formData.password) {
            newErrors.password = 'Şifre gereklidir';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Şifre en az 6 karakter, büyük/küçük harf ve rakam içermelidir';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Şifreler eşleşmiyor';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'Kullanım şartlarını kabul etmelisiniz';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length === 0) {
            setIsSubmitting(true);
            setSubmitMessage({ type: '', text: '' });

            try {
                // Backend yapınıza uygun şekilde kullanıcı verisini oluştur
                const userData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                };

                // api.js'deki signup fonksiyonunu kullan
                await signup(userData);

                setSubmitMessage({
                    type: 'success',
                    text: 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...'
                });

                setTimeout(() => {
                    navigate('/login');
                }, 2000);

            } catch (error) {
                console.error('Kayıt hatası:', error);

                let errorMessage = 'Kayıt sırasında bir hata oluştu.';

                if (error.response) {
                    if (error.response.data && error.response.data.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response.status === 409) {
                        errorMessage = 'Bu e-posta adresi zaten kullanılıyor.';
                    }
                } else if (error.request) {
                    errorMessage = 'Sunucuya ulaşılamıyor. Lütfen daha sonra tekrar deneyin.';
                }

                setSubmitMessage({
                    type: 'error',
                    text: errorMessage
                });
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className='signup-container'>
            <div className='signup-card'>
                <h1 className='signup-title'>Kayıt Ol</h1>
                <form className='signup-form' onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label htmlFor='firstName'>Ad</label>
                        <input
                            type='text'
                            id='firstName'
                            name='firstName'
                            value={formData.firstName}
                            onChange={handleChange}
                            className={errors.firstName ? 'error' : ''}
                        />
                        {errors.firstName && <span className='error-text'>{errors.firstName}</span>}
                    </div>
                    
                    <div className='input-group'>
                        <label htmlFor='lastName'>Soyad</label>
                        <input
                            type='text'
                            id='lastName'
                            name='lastName'
                            value={formData.lastName}
                            onChange={handleChange}
                            className={errors.lastName ? 'error' : ''}
                        />
                        {errors.lastName && <span className='error-text'>{errors.lastName}</span>}
                    </div>

                    <div className='input-group'>
                        <label htmlFor='email'>E-posta</label>
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

                    <div className='input-group'>
                        <label htmlFor='confirmPassword'>Şifre Tekrar</label>
                        <input
                            type='password'
                            id='confirmPassword'
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'error' : ''}
                        />
                        {errors.confirmPassword && <span className='error-text'>{errors.confirmPassword}</span>}
                    </div>

                    <div className='signup-options'>
                        <div className='terms'>
                            <input
                                type='checkbox'
                                id='acceptTerms'
                                name='acceptTerms'
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                            />
                            <label htmlFor='acceptTerms'>Kullanım şartlarını kabul ediyorum</label>
                        </div>
                        {errors.acceptTerms && <span className='error-text'>{errors.acceptTerms}</span>}
                    </div>

                    {submitMessage.text && (
                        <div className={`alert ${submitMessage.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                            {submitMessage.text}
                        </div>
                    )}

                    <button
                        type='submit'
                        className='signup-button'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}
                    </button>

                    <div className='login-link'>
                        Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;