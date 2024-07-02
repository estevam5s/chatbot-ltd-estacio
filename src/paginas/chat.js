import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import '../estilos/chat.css';

const steps = [
  { question: 'Tudo bem com você?', key: 'resposta', section: 'resposta' },
  { question: 'Vamos começar agora as perguntas para o seu novo currículo, você está de acordo?', key: 'resposta', section: 'resposta' },
  { question: 'Qual é o seu nome?', key: 'cliente', section: 'dadosPessoais' },
  { question: 'Qual é o seu melhor E-mail?', key: 'E-mail', section: 'dadosPessoais' },
  { question: 'Qual é o seu número de Telefone?', key: 'Telefone', section: 'dadosPessoais' },
  { question: 'Qual é a sua cidade?', key: 'Cidade', section: 'dadosPessoais' },
  { question: 'Qual é o seu bairro?', key: 'Bairro', section: 'dadosPessoais' },
  { question: 'Qual é o seu Linkedin?', key: 'Linkedin', section: 'dadosPessoais' },
  { question: 'Qual é a sua data de nascimento?', key: 'Data de nascimento', section: 'dadosPessoais' },
  { question: 'Vamos falar agora sobre o seu Objetivo profissional, podemos começar?', key: 'resposta', section: 'resposta' },
  { question: 'Descreva seu objetivo profissional.', key: 'descricao', section: 'objetivoProfissional' },
  { question: 'Vamos falar agora sobre a sua formação acadêmica, podemos começar?', key: 'resposta', section: 'resposta' },
  { question: 'Qual é o seu curso?', key: 'curso', section: 'academica' },
  { question: 'Qual é a instituição de ensino?', key: 'instituicao', section: 'academica' },
  { question: 'Quantos semestres ao todo tem o seu curso?', key: 'periodo', section: 'academica' },
  { question: 'Qual é o status atual do curso?', key: 'statusAtual', section: 'academica' },
  { question: 'Qual é a fase atual do curso?', key: 'faseAtual', section: 'academica' },
  { question: 'Deseja adicionar outra formação? (sim ou não)', key: 'adicionarAcademica', section: 'academica' },
  { question: 'Vamos falar agora sobre a sua carreira, podemos dar continuidade?', key: 'resposta', section: 'resposta' },
  { question: 'Qual é o nome da empresa em que trabalha ou já trabalhou?', key: 'empresa', section: 'experiencia' },
  { question: 'Qual era o cargo ocupado ou que ocupa atualmente?', key: 'trabalho', section: 'experiencia' },
  { question: 'Quanto tempo você ficou trabalhando ou ainda trabalha?', key: 'duracao', section: 'experiencia' },
  { question: 'Descreva uma função que você desempenha ou que já desempenhou.', key: 'descricao', section: 'experiencia' },
  { question: 'Descreva uma outra função.', key: 'Sdescricao', section: 'experiencia' },
  { question: 'Deseja adicionar outra experiência? (sim ou não)', key: 'adicionarExperiencia', section: 'experiencia' },
  { question: 'Agora falaremos sobre as suas certificações, podemos começar?', key: 'resposta', section: 'resposta' },
  { question: 'Qual é o nome do seu certificado?', key: 'nome', section: 'certificacoes' },
  { question: 'Qual é o curso relacionado ao certificado?', key: 'curso', section: 'certificacoes' },
  { question: 'Qual é a instituição emissora do certificado?', key: 'instituicao', section: 'certificacoes' },
  { question: 'Deseja adicionar outro certificado? (sim ou não)', key: 'adicionarCertificacao', section: 'certificacoes' },
  { question: 'Chegamos no final, podemos dar continuidade?', key: 'resposta', section: 'resposta' },
  { question: 'Qual idioma você fala?', key: 'lingua', section: 'idiomas' },
  { question: 'Qual é o seu nível de fluência no idioma?', key: 'fluencia', section: 'idiomas' },
  { question: 'Possui outro Idioma? Qual outro idioma você fala?', key: 'lingua2', section: 'idiomas' },
  { question: 'Qual é o seu nível de fluência no idioma?', key: 'fluencia2', section: 'idiomas' },
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
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(10, yOffset + 2, 10 + textWidth, yOffset + 2);
      yOffset += 10;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(14);

      Object.keys(content).forEach((key) => {
        const text = `${key}: ${content[key]}`;
        doc.text(text, 10, yOffset);
        yOffset += 10;
      });
      yOffset += 10;
    };

    const addArraySection = (title, contentArray) => {
      contentArray.forEach((content, index) => {
        addSection(`${title} ${index + 1}`, content);
      });
    };

    addSection('Dados Pessoais', curriculoData.dadosPessoais);
    addSection('Objetivo Profissional', curriculoData.objetivoProfissional);
    addArraySection('Formação Acadêmica', curriculoData.academica);
    addArraySection('Experiência Profissional', curriculoData.experiencia);
    addArraySection('Certificações', curriculoData.certificacoes);
    addSection('Idiomas', curriculoData.idiomas);

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
