import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../estilos/noticias.css';

const Noticias = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: 'inteligência artificial',
            apiKey: process.env.REACT_APP_NEWS_API_KEY, // Usando variável de ambiente
            language: 'pt',
            sortBy: 'publishedAt',
          },
        });
        setNews(response.data.articles);
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="noticias-container">
      <h2 className="title">Notícias sobre IA</h2>
      {news.map((article, index) => (
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
      ))}
    </div>
  );
};

export default Noticias;
