import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/LoginSignup/Login';
import Signup from './Components/LoginSignup/Signup';
import Home from './Components/Home/home';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import { Link } from 'react-router-dom';
import Profile from './Components/Profile/Profile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route exact path='/' element={<Home/>} />
          <Route exact path='/login' element ={<Login />} />
          <Route exact path='/signup' element ={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>

          <Route path="*" element={
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              flexDirection: 'column'
            }}>
              <h1>Sayfa bulunamadı</h1>
              <p>Aradığınız sayfa mevcut değil.</p>
              <Link to="/" style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#4b0082',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
              }}>
                Ana Sayfaya Dön
              </Link>
            </div>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
