import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../estilos/noticias.css';

const Noticias = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: 'inteligência artificial',
            apiKey: "adefb2b75dd2463b82c7611c86c09b74", // Usando variável de ambiente
            language: 'pt',
            sortBy: 'publishedAt',
          },
        });
        setNews(response.data.articles);
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
        setError('Erro ao buscar notícias. Por favor, tente novamente mais tarde.');
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="noticias-container">
      <h2 className="title">Notícias sobre IA</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        news.map((article, index) => (
          <div key={index} className="noticia">
            <img src={article.urlToImage} alt={article.title} className="noticia-img" />
            <div className="noticia-content">
              <h3 className="noticia-title">{article.title}</h3>
              <p className="noticia-description">{article.description}</p>
              <p className="noticia-author">Por: {article.author || 'Desconhecido'}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="noticia-link">
                Ler notícia completa
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Noticias;
