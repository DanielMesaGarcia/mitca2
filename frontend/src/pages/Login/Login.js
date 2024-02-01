import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import './Login.css';
import { Link, useNavigate  } from 'react-router-dom';
import UserService from '../../services/logInService'; // Adjust the path according to your file structure
import Footer from '../../components/footer/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Use useNavigate hook

  const handleLogin = async () => {
    try {
      const response = await UserService.login({ _id: email, password });
      // Handle the response as per your requirements
    
      // Save the token to the local storage
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      // Redirect to the home page
      if(localStorage.getItem('role') === 'admin'){
        navigate('/homeAdmin');
      }else{
      navigate('/home');
      }
    } catch (error) {
      // Handle the error
      console.error('Error while logging in:', error);
    }
  };

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);
  

  return (
    <div className="login-container">
      <div className="background-image">
        <img src="/img/couple.jpg" alt="Background" className="bg-img" />
      </div>
      <div className="login-form">
        <h2>Bienvenido a la Maratón</h2>
        <Input
          placeholder="Correo electrónico"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input.Password
          placeholder="Contraseña"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link to="/signin">
          <Button type="primary" className="signin-button">
            Crear cuenta
          </Button>
        </Link>

        <Button type="primary" className="login-button" onClick={handleLogin}>
          Iniciar sesión
        </Button>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Login;
