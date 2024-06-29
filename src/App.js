import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './paginas/login';  // Corrigido: caminho relativo a partir de src
import Cadastro from './paginas/cadastro';
import Configuracao from './paginas/configuracao';  // Corrigido: caminho relativo a partir de src
import Creditos from './paginas/creditos';  // Corrigido: caminho relativo a partir de src
import Noticias from './paginas/noticias';  // Corrigido: caminho relativo a partir de src
import Chat from './paginas/chat';  // Corrigido: caminho relativo a partir de src
import './estilos/app.css';  // Corrigido: caminho relativo a partir de src

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/chat" className="nav-link">Chat CR</Link>
            </li>
            <li className="nav-item">
              <Link to="/noticias" className="nav-link">Notícias</Link>
            </li>
            <li className="nav-item">
              <Link to="/configuracao" className="nav-link">Drive Estácio</Link>
            </li>
            <li className="nav-item">
              <Link to="/creditos" className="nav-link">Créditos</Link>
            </li>
          </ul>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />  {/* Corrigido: caminho da rota */}
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/configuracao" element={<Configuracao />} />
            <Route path="/creditos" element={<Creditos />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>

        <div className="login-link">
          <Link to="/login" className="nav-link">Login</Link>
        </div>
      </div>
    </Router>
  );
}

export default App;
