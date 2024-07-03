import React from 'react';
import '../estilos/creditos.css';

const teamMembers = [
  {
    name: 'Nome do Membro 1',
    role: 'Função',
    description: 'Breve descrição sobre o membro.',
  },
  {
    name: 'Nome do Membro 2',
    role: 'Função',
    description: 'Breve descrição sobre o membro.',
  },
  // Adicione mais membros conforme necessário
];

const Creditos = () => {
  return (
    <div className="creditos-container">
      <h2 className="title">Créditos</h2>
      <section className="ltd-description">
        <h3>O que é o LTD?</h3>
        <p>
          O Laboratório de Transformação Digital (LTD) da Estácio é um espaço dedicado à inovação e ao desenvolvimento de tecnologias digitais. 
          Nosso objetivo é fomentar a transformação digital através de projetos, pesquisas e capacitações que promovam a integração entre 
          o conhecimento acadêmico e as demandas do mercado.
        </p>
      </section>
      <section className="team-members">
        <h3>Equipe do LTD</h3>
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member">
            <h4>{member.name}</h4>
            <p><strong>Função:</strong> {member.role}</p>
            <p>{member.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Creditos;
