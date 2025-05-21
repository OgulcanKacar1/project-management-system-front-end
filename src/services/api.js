// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Token işlemleri
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Kullanıcı işlemleri
const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    setAuthToken(response.data.token);
  }
  return response.data;
};

const signup = async (userData) => {
  return await axios.post(`${API_URL}/auth/signup`, userData);
};

// Proje işlemleri
const getMyProjects = async () => {
  return await axios.get(`${API_URL}/projects/my-projects`);
};

const createProject = async (projectData) => {
  return await axios.post(`${API_URL}/projects`, projectData);
};

const updateProject = async (projectId, projectData) => {
  return await axios.put(`${API_URL}/projects/${projectId}`, projectData);
};

const deleteProject = async (projectId) => {
  return await axios.delete(`${API_URL}/projects/${projectId}`);
};

export {
  setAuthToken,
  login,
  signup,
  getMyProjects,
  createProject,
  updateProject,
  deleteProject
};