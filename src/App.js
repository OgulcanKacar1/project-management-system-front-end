import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/LoginSignup/Login';
import Signup from './Components/LoginSignup/Signup';
import Home from './Components/Home/home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Home/>} />
          <Route exact path='/login' element ={<Login />} />
          <Route exact path='/signup' element ={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
