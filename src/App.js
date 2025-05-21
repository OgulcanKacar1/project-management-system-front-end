import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/LoginSignup/Login';
import Signup from './Components/LoginSignup/Signup';
import Home from './Components/Home/home';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import { Link } from 'react-router-dom';
import Profile from './Components/Profile/Profile';
import Dashboard from './Components/Dashboard/Dashboard';
import AppLayout from './Components/Layout/AppLayout';
import ProjectsPage from './Components/Dashboard/ProjectsPage';
import ProjectDetails from './Components/Dashboard/ProjectDetails';
import NotFound from './Components/Common/NotFound';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Halka açık sayfalar */}
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          
          {/* Ana sayfa yönlendirmesi */}
          <Route path='/' element={<Navigate to="/home" />} />
          
          {/* Korumalı sayfalar - AppLayout ile */}
          <Route element={<ProtectedRoute />}>
            {/* Dashboard alanı */}
            <Route path="/dashboard" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:id" element={<ProjectDetails />} />
              <Route path="tasks" element={<div>Görevler Sayfası</div>} />
              <Route path="settings" element={<div>Ayarlar Sayfası</div>} />
              <Route path="profile" element={<div>Profil Sayfası</div>} />
            </Route>
            
            {/* Profil sayfası */}
            <Route path='/profile' element={<Profile />} />
          </Route>
          
          {/* 404 sayfası */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;