import React from 'react';
import '../estilos/cadastro.css';
import logo from '../img/logocr.png';
import iconEmail from '../img/icongmail.png';
import iconPassword from '../img/iconpassworld.png';
import iconGoogle from '../img/icongoogle.png';  
import { Link } from 'react-router-dom';

const Cadastro = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="title">Register</h2>
        <div className="input-container">
          <input type="email" placeholder="Email" className="input" />
          <img src={iconEmail} alt="Email" className="iconemail" />
        </div>
        <div className="input-container">
          <input type="email" placeholder="Repeat your Email" className="input" />
          <img src={iconEmail} alt="Repeat your Email" className="iconemail" />
        </div>
        <div className="input-container">
          <input type="password" placeholder="Password" className="input" />
          <img src={iconPassword} alt="Password" className="iconpassword" />
        </div>
        <div className="input-container">
          <input type="password" placeholder="Repeat your Password" className="input" />
          <img src={iconPassword} alt="Repeat your Password" className="iconpassword" />
        </div>
        <button className="sign-in-button">Register</button>
        <div className="google-sign-in">
          <img src={iconGoogle} alt="Google Sign In" className="google-icon" />
        </div>
        <p className="register-prompt">
          You already have an account? <Link to="/login" className="register-link">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;
