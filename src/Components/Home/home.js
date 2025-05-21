import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgisini kontrol et
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("localStorage'dan kullanıcı bilgisi alınırken hata:", error);
      setUser(null);
    }
  }, []);
  return (
    <>
    <Navbar />  
      <div className="hero-container">
        <div className="hero-content">
          <h1>Project Management System</h1>
          <p>Profesyonel proje yönetimi için güçlü çözümler</p>
          <div className="hero-btns">
            {user ? (
              <button className="btn btn-primary">
                <Link to="/dashboard" className="btn-link">Hemen Başla</Link>
              </button>
            ) : (
              <>
                <button className="btn btn-primary">
                  <Link to="/signup" className="btn-link">Kayıt Ol</Link>
                </button>
                <button className="btn btn-outline">
                  <Link to="/login" className="btn-link">Giriş Yap</Link>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <section className="features">
      <div className="feature-card">
        <h3>Proje Takibi</h3>
        <p>Tüm projelerinizi tek bir yerden yönetin. Görevleri oluşturun, önceliklendirin ve zamanında tamamlayın.</p>
        <p>Proje ilerlemesini görselleştirmek için Gantt şemaları ve zaman çizelgeleri kullanın.</p>
      </div>
      <div className="feature-card">
        <h3>Ekip Yönetimi</h3>
        <p>Ekip üyelerinizle kolayca işbirliği yapın. Görevleri ekip üyelerine atayın ve ilerlemeyi takip edin.</p>
        <p>Gerçek zamanlı mesajlaşma ve dosya paylaşımı ile iletişimi güçlendirin.</p>
      </div>
      <div className="feature-card">
        <h3>Raporlama</h3>
        <p>Detaylı raporlarla performansınızı izleyin. Proje bütçesi, zaman yönetimi ve ekip verimliliği hakkında bilgi alın.</p>
        <p>Özelleştirilebilir raporlar ve grafiklerle karar alma süreçlerinizi destekleyin.</p>
      </div>
      <div className="feature-card">
        <h3>Görev Yönetimi</h3>
        <p>Görevleri oluşturun, önceliklendirin ve tamamlanma durumlarını takip edin.</p>
        <p>Görevlerinize son teslim tarihleri ekleyerek zamanında tamamlanmasını sağlayın.</p>
      </div>
</section>
    </>
  );
};

export default Home;