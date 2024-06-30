import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import '../estilos/chat.css';

const steps = [
  { question: 'Qual é o seu nome?', key: 'cliente', section: 'dadosPessoais' },
  { question: 'Tudo bem com você?', key: 'resposta', section: 'resposta' },
  { question: 'Qual é o seu email?', key: 'email', section: 'dadosPessoais' },
  { question: 'Qual é o seu telefone?', key: 'telefone', section: 'dadosPessoais' },
  { question: 'Qual é a sua cidade?', key: 'cidade', section: 'dadosPessoais' },
  { question: 'Qual é o seu bairro?', key: 'bairro', section: 'dadosPessoais' },
  { question: 'Qual é o seu Linkedin?', key: 'linkedin', section: 'dadosPessoais' },
  { question: 'Qual é a sua data de nascimento?', key: 'dataNascimento', section: 'dadosPessoais' },
  { question: 'Descreva seu objetivo profissional.', key: 'descricao', section: 'objetivoProfissional' },
  { question: 'Qual é o seu curso?', key: 'curso', section: 'academica' },
  { question: 'Qual é a instituição de ensino?', key: 'instituicao', section: 'academica' },
  { question: 'Qual é o período do curso?', key: 'periodo', section: 'academica' },
  { question: 'Qual é o status atual do curso?', key: 'statusAtual', section: 'academica' },
  { question: 'Qual é a fase atual do curso?', key: 'faseAtual', section: 'academica' },
  { question: 'Qual é o nome da empresa em que trabalhou?', key: 'empresa', section: 'experiencia' },
  { question: 'Qual era o cargo ocupado?', key: 'trabalho', section: 'experiencia' },
  { question: 'Qual foi a duração do trabalho?', key: 'duracao', section: 'experiencia' },
  { question: 'Descreva uma função que você desempenhou.', key: 'descricao', section: 'experiencia', subkey: 'descricoes' },
  { question: 'Qual é o nome do seu certificado?', key: 'nome', section: 'certificacoes' },
  { question: 'Qual é o curso relacionado ao certificado?', key: 'curso', section: 'certificacoes' },
  { question: 'Qual é a instituição emissora do certificado?', key: 'instituicao', section: 'certificacoes' },
  { question: 'Qual idioma você fala?', key: 'lingua', section: 'idiomas' },
  { question: 'Qual é o seu nível de fluência no idioma?', key: 'fluencia', section: 'idiomas' },
];

const getGreeting = () => {
  const currentTime = new Date().getHours();
  if (currentTime < 12) {
    return 'Bom dia! Espero que o seu dia seja especial';
  } else if (currentTime < 18) {
    return 'Boa tarde! Como está sendo o seu dia';
  } else {
    return 'Boa noite!';
  }
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [curriculoData, setCurriculoData] = useState({
    resposta: {},
    dadosPessoais: {},
    objetivoProfissional: {},
    academica: [],
    experiencia: [],
    certificacoes: [],
    idiomas: []
  });
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const greeting = getGreeting();
    setMessages([{ type: 'bot', text: greeting }]);
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: steps[currentStep].question }]);
      setIsTyping(true);
    }, 2000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentStep > 0 && currentStep < steps.length) {
      const step = steps[currentStep];
      setIsTyping(true);

      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: step.question }]);
        setIsTyping(false);
      }, 2000);
    } else if (currentStep === steps.length) {
      setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: 'Obrigado por fornecer todas as informações! Clique no botão abaixo para baixar seu currículo.' }]);
    }
  }, [currentStep]);

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = { type: 'user', text: input };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const step = steps[currentStep];
      const newData = { ...curriculoData };

      if (['experiencia', 'academica', 'certificacoes', 'idiomas'].includes(step.section)) {
        const sectionArray = newData[step.section];
        const index = sectionArray.length - 1;

        if (sectionArray[index] && !sectionArray[index][step.key]) {
          sectionArray[index][step.key] = input;
        } else {
          const newItem = { [step.key]: input };
          if (step.subkey) newItem[step.subkey] = [input];
          sectionArray.push(newItem);
        }
      } else {
        newData[step.section][step.key] = input;
      }

      setCurriculoData(newData);
      setInput('');
      setCurrentStep(currentStep + 1);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const nomePessoa = curriculoData.dadosPessoais.cliente || 'Currículo';
    doc.setFont('Helvetica');
    doc.setFontSize(20);
    doc.text(nomePessoa, 105, 10, null, null, 'center');

    doc.setFontSize(14);
    let yOffset = 30;

    const addSection = (title, content) => {
      doc.setFontSize(16);
      doc.setFont('Helvetica', 'bold');
      doc.text(title, 10, yOffset);
      const textWidth = doc.getTextWidth(title);
      doc.setDrawColor(0, 0, 0); // Preto
      doc.line(10, yOffset + 2, 10 + textWidth, yOffset + 2); // Sublinhado
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(12);
      yOffset += 10;
      const splitContent = doc.splitTextToSize(content || '', doc.internal.pageSize.width - 20);
      splitContent.forEach((line, index) => {
        if (line.includes('@') || line.includes('linkedin.com')) {
          doc.setTextColor(0, 0, 255); // Azul para links e emails
        } else {
          doc.setTextColor(0, 0, 0); // Preto para o restante
        }
        doc.text(line, 10, yOffset + (index * (doc.internal.getLineHeight() / doc.internal.scaleFactor)));
      });
      yOffset += splitContent.length * (doc.internal.getLineHeight() / doc.internal.scaleFactor);
      yOffset += 10;
    };

    const formatAcademica = (academica) => {
      return academica.map((a) => (
        `Graduação: ${a.curso}\n` +
        `Instituição: ${a.instituicao}\n` +
        `Período: ${a.periodo}\n` +
        `Semestre: ${a.faseAtual}\n`
      )).join('\n\n');
    };

    const formatExperiencia = (experiencia) => {
      return experiencia.map((e) => (
        `Empresa: ${e.empresa}\n` +
        `Trabalho: ${e.trabalho}\n` +
        `Duração: ${e.duracao}\n` +
        `Descrição: ${e.descricoes ? e.descricoes.join(', ') : ''}\n`
      )).join('\n\n');
    };

    addSection('Dados Pessoais', Object.entries(curriculoData.dadosPessoais).map(([key, value]) => `${key}: ${value}`).join('\n'));
    addSection('Objetivo Profissional', curriculoData.objetivoProfissional.descricao || '');
    addSection('Formação Acadêmica', formatAcademica(curriculoData.academica));
    addSection('Experiência', formatExperiencia(curriculoData.experiencia));
    addSection('Certificações', curriculoData.certificacoes.map((c) => `${c.nome} - ${c.curso} (${c.instituicao})`).join('\n'));
    addSection('Idiomas', curriculoData.idiomas.map((i) => `${i.lingua}: ${i.fluencia}`).join('\n'));

    doc.save('curriculo.pdf');
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">Chat CR</h2>
      <div className="chat-box">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}-message`}>
              {message.text}
            </div>
          ))}
          {isTyping && (
            <div className="message bot-message">
              <span className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          )}
          {currentStep >= steps.length && (
            <div className="message bot-message">
              <button onClick={generatePDF} className="download-link">
                Baixar Currículo
              </button>
            </div>
          )}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(); }}
          />
          <button className="send-button" onClick={sendMessage}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
