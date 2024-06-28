import React from 'react';
import '../estilos/login.css';
import logo from '../img/logocr.png';
import iconEmail from '../img/icongmail.png';
import iconPassword from '../img/iconpassworld.png';
import iconGoogle from '../img/icongoogle.png';
import { Link } from 'react-router-dom'; // Importar Link

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="title">Login</h2>
        <div className="input-container">
          <input type="email" placeholder="Email" className="input" />
          <img src={iconEmail} alt="Email" className="iconemail" />
        </div>
        <div className="input-container">
          <input type="password" placeholder="Password" className="input" />
          <img src={iconPassword} alt="Password" className="iconpassword" />
        </div>
        <button className="sign-in-button">Sign In</button>
        <div className="google-sign-in">
          <img src={iconGoogle} alt="Google Sign In" />
        </div>
        <p className="register-prompt">
          You don't have an account? <Link to="/cadastro" className="register-link">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
