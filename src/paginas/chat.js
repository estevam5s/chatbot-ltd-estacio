import React, { useEffect, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import '../estilos/chat.css';

const steps = [
  { question: 'Tudo bem com você?', key: 'resposta', section: 'resposta' },
  { question: 'Qual é o seu nome?', key: 'Cliente', section: 'dadosPessoais' },
  { question: 'Qual é o seu melhor E-mail?', key: 'E-mail', section: 'dadosPessoais' },
  { question: 'Qual é o seu número de Telefone?', key: 'Telefone', section: 'dadosPessoais' },
  { question: 'Qual é a sua cidade?', key: 'Cidade', section: 'dadosPessoais' },
  { question: 'Qual é o seu bairro?', key: 'Bairro', section: 'dadosPessoais' },
  { question: 'Qual é o seu Linkedin?', key: 'Linkedin', section: 'dadosPessoais' },
  { question: 'Qual é a sua data de nascimento?', key: 'Data de nascimento', section: 'dadosPessoais' },
  { question: 'Descreva seu objetivo profissional.', key: 'descricao', section: 'objetivoProfissional' },
  { question: 'Qual é o nome do seu curso?', key: 'Curso', section: 'academica' },
  { question: 'Qual é a instituição de ensino?', key: 'Instituicao', section: 'academica' },
  { question: 'Quantos semestres ao todo tem o seu curso?', key: 'Periodo', section: 'academica' },
  { question: 'Qual é o status atual do curso?', key: 'Status', section: 'academica' },
  { question: 'Qual é a fase atual do curso?', key: 'Fase atual', section: 'academica' },
  { question: 'Deseja adicionar outra formação? (sim ou não)', key: 'adicionarAcademica', section: 'academica' },
  { question: 'Qual é o nome da empresa em que trabalha ou já trabalhou?', key: 'Empresa', section: 'experiencia' },
  { question: 'Qual era o cargo ocupado ou que ocupa atualmente?', key: 'Cargo', section: 'experiencia' },
  { question: 'Quanto tempo você ficou trabalhando ou ainda trabalha?', key: 'Duracao', section: 'experiencia' },
  { question: 'Descreva uma função que você desempenha ou que já desempenhou.', key: 'Descricao', section: 'experiencia' },
  { question: 'Descreva uma outra função.', key: 'Descricao', section: 'experiencia' },
  { question: 'Deseja adicionar outra experiência? (sim ou não)', key: 'adicionarExperiencia', section: 'experiencia' },
  { question: 'Qual é o nome do seu certificado?', key: 'nome', section: 'certificacoes' },
  { question: 'Qual é o curso relacionado ao certificado?', key: 'Curso', section: 'certificacoes' },
  { question: 'Qual é a instituição emissora do certificado?', key: 'Instituicao', section: 'certificacoes' },
  { question: 'Deseja adicionar outro certificado? (sim ou não)', key: 'adicionarCertificacao', section: 'certificacoes' },
  { question: 'Qual idioma você fala?', key: 'Lingua', section: 'idiomas' },
  { question: 'Qual é o seu nível de fluência no idioma?', key: 'Fluencia', section: 'idiomas' },
  { question: 'Qual outro idioma você fala?', key: 'Lingua', section: 'idiomas' },
  { question: 'Qual é o seu nível de fluência no idioma?', key: 'Fluencia', section: 'idiomas' },
];

const getGreeting = () => {
  const currentTime = new Date().getHours();
  if (currentTime < 12) {
    return 'Bom dia! Espero que o seu dia seja especial';
  } else if (currentTime < 18) {
    return 'Boa tarde! Como está sendo o seu dia';
  } else {
    return 'Boa noite! Como foi o seu dia';
  }
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [addingMore, setAddingMore] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [currentSection, setCurrentSection] = useState('');
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
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = { type: 'user', text: input };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const step = steps[currentStep];
      const newData = { ...curriculoData };

      if (step.key.startsWith('adicionar')) {
        const section = step.section;
        if (input.toLowerCase() === 'sim') {
          const sectionStartStep = steps.findIndex(s => s.section === section && !s.key.startsWith('adicionar'));
          setCurrentStep(sectionStartStep);
        } else {
          setCurrentStep(currentStep + 1);
        }
      } else if (['experiencia', 'academica', 'certificacoes'].includes(step.section)) {
        if (!addingMore) {
          newData[step.section].push({ [step.key]: input });
          setCurrentSection(step.section);
        } else {
          const sectionArray = newData[step.section];
          sectionArray[sectionArray.length - 1][step.key] = input;
        }
        setAddingMore(true);
        if (steps[currentStep + 1].key.startsWith('adicionar')) {
          setCurrentStep(currentStep + 1);
          setAddingMore(false);
        } else {
          setCurrentStep(currentStep + 1);
        }
      } else {
        newData[step.section][step.key] = input;
        setCurrentStep(currentStep + 1);
      }

      setCurriculoData(newData);
      setInput('');
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

      content.forEach(item => {
        Object.entries(item).forEach(([key, value]) => {
          const isEmail = (key.toLowerCase() === 'e-mail');
          const isLinkedin = (key.toLowerCase() === 'linkedin');
          const keyText = `${key}: `;
          const valueText = isEmail ? value : isLinkedin ? value : `${value}`;
          const keyColor = isEmail || isLinkedin ? [0, 0, 0] : [0, 0, 0]; // Preto para tudo
          const valueColor = isEmail ? [0, 0, 255] : isLinkedin ? [0, 0, 255] : [0, 0, 0]; // Azul para e-mail e LinkedIn, preto para o restante
          
          doc.setTextColor(...keyColor);
          doc.text(keyText, 10, yOffset);
          const keyWidth = doc.getTextWidth(keyText);
          
          doc.setTextColor(...valueColor);
          doc.text(valueText, 10 + keyWidth, yOffset);
          yOffset += doc.internal.getLineHeight() / doc.internal.scaleFactor;
        });
        yOffset += 5; // Espaço entre os itens
      });

      yOffset += 10; // Espaço após a seção
    };


    addSection('Dados Pessoais', [curriculoData.dadosPessoais]);
    addSection('Objetivo Profissional', [curriculoData.objetivoProfissional]);
    addSection('Formação Acadêmica', curriculoData.academica);
    addSection('Experiência Profissional', curriculoData.experiencia);
    addSection('Certificações', curriculoData.certificacoes);
    addSection('Idiomas', [curriculoData.idiomas]);

    doc.save(`${nomePessoa}_curriculo.pdf`);
  };

  // eslint-disable-next-line no-unused-vars
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
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
