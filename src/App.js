/* eslint-disable no-lone-blocks */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Cadastro from './paginas/cadastro';
import Extra from './paginas/extra';
import Creditos from './paginas/creditos'; 
import Noticias from './paginas/noticias'; 
import Chat from './paginas/chat';  
import './estilos/app.css';

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <nav className="navbar">
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active-press' : ''}`}>Chat</Link>
          </li>
          <li className="nav-item">
            <Link to="/noticias" className={`nav-link ${location.pathname === '/noticias' ? 'active-press' : ''}`}>Notícias</Link>
          </li>
          <li className="nav-item">
            <Link to="/extra" className={`nav-link ${location.pathname === '/extra' ? 'active-press' : ''}`}>Extra</Link>
          </li>
          <li className="nav-item">
            <Link to="/creditos" className={`nav-link ${location.pathname === '/creditos' ? 'active-press' : ''}`}>Créditos</Link>
          </li>
        </ul>
      </nav>

      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/chat" />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/extra" element={<Extra />} />
          <Route path="/creditos" element={<Creditos />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

