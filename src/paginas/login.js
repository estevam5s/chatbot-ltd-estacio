import React, { useState } from 'react';
import '../estilos/login.css';
import logo from '../img/logocr.png';
import iconEmail from '../img/icongmail.png';
import iconPassword from '../img/iconpassworld.png';
import iconGoogle from '../img/icongoogle.png';
import { Link } from 'react-router-dom';
import prisma from '../prisma'; // Importe o Prisma Client

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await prisma.user.create({
        data: {
          email,
          password
        }
      });
      alert('User registered successfully!');
    } catch (error) {
      console.error(error);
      alert('An error occurred while registering the user.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="email"
              placeholder="Email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <img src={iconEmail} alt="Email" className="iconemail" />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img src={iconPassword} alt="Password" className="iconpassword" />
          </div>
          <button type="submit" className="sign-in-button">Sign In</button>
        </form>
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
