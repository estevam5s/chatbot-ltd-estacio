import React from 'react';
import '../estilos/configuracao.css';

const Configuracao = () => {
  return (
    <div className="configuracao-container">
      <h2 className="title">Informações extras</h2>
      <div className="info-section">
        <h3 className="section-title">Como fazer um currículo</h3>
        <p className="section-content">
          Aprenda a criar um currículo eficaz que destaque suas habilidades e experiências.
          Visite nosso guia completo no <a href="https://drive.google.com/drive/folders/1W3LqVf1waEbyDLQU92fCAPzMzjpkszmM" target="_blank" rel="noopener noreferrer">Drive da Estácio</a>.
        </p>
      </div>
      <div className="info-section">
        <h3 className="section-title">Utilização de Inteligência Artificial (IA)</h3>
        <p className="section-content">
          Descubra como as diversas aplicações de IA podem transformar negócios e processos.
          Explore mais no <a href="https://drive.google.com/drive/folders/1IlWp7zQ6HNQVuYOnjhkXJ9Wh8zhU7iUm" target="_blank" rel="noopener noreferrer">Drive da Estácio</a>.
        </p>
      </div>
      <div className="info-section">
        <h3 className="section-title">Segurança Cibernética</h3>
        <p className="section-content">
          Dicas essenciais para se proteger de ataques de cyber criminosos e manter seus dados seguros.
          Consulte nossos recursos no <a href="https://drive.google.com/drive/folders/1VuDt6rouIkN1J9gEP5OxpHqptRFlamms" target="_blank" rel="noopener noreferrer">Drive da Estácio</a>.
        </p>
      </div>
    </div>
  );
}

export default Configuracao;
