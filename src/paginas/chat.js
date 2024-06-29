import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import '../estilos/chat.css';

const steps = [
  { question: 'Tudo bem com você?', key: 'cliente', section: 'resposta' },
  { question: 'Qual é o seu email?', key: 'email', section: 'dadosPessoais' },
  { question: 'Qual é o seu telefone?', key: 'telefone', section: 'dadosPessoais' },
  { question: 'Qual é a sua cidade?', key: 'cidade', section: 'dadosPessoais' },
  { question: 'Qual é a sua data de nascimento?', key: 'dataNascimento', section: 'dadosPessoais' },
  { question: 'Descreva seu objetivo profissional.', key: 'descricao', section: 'objetivoProfissional' },
  { question: 'Qual é o seu curso?', key: 'curso', section: 'academica' },
  { question: 'Qual é a instituição de ensino?', key: 'instituicao', section: 'academica' },
  { question: 'Qual é o período do curso?', key: 'periodo', section: 'academica' },
  { question: 'Qual é o status atual do curso?', key: 'statusAtual', section: 'academica' },
  { question: 'Qual é a fase atual do curso?', key: 'faseAtual', section: 'academica' },
  { question: 'Qual é o nome da empresa em que trabalhou?', key: 'nome', section: 'experiencia' },
  { question: 'Qual era o cargo ocupado?', key: 'cargo', section: 'experiencia' },
  { question: 'Descreva uma função que você desempenhou.', key: 'funcao1', section: 'experiencia', subkey: 'funcoes' },
  { question: 'Descreva outra função que você desempenhou.', key: 'funcao2', section: 'experiencia', subkey: 'funcoes' },
  { question: 'Qual é o nome do seu certificado?', key: 'nome', section: 'certificacoes' },
  { question: 'Qual é o curso relacionado ao certificado?', key: 'curso', section: 'certificacoes' },
  { question: 'Qual é a instituição emissora do certificado?', key: 'instituicao', section: 'certificacoes' },
  { question: 'Qual idioma você fala?', key: 'lingua', section: 'idiomas' },
  { question: 'Qual é o seu nível de fluência no idioma?', key: 'fluencia', section: 'idiomas' },
];

const getGreeting = () => {
  const currentTime = new Date().getHours();
  if (currentTime < 12) {
    return 'Bom dia!';
  } else if (currentTime < 18) {
    return 'Boa tarde!';
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
    // Saudação inicial
    const greeting = getGreeting();
    setMessages([{ type: 'bot', text: greeting }]);
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: steps[currentStep].question }]);
      setIsTyping(true);
    }, 2000); // Delay of 2 seconds (2000 milliseconds)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentStep > 0 && currentStep < steps.length) {
      const step = steps[currentStep];
      setIsTyping(true);

      // Simular o atraso de 2 segundos antes de exibir a pergunta
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: step.question }]);
        setIsTyping(false);
      }, 2000); // Delay of 2 seconds (2000 milliseconds)
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
    doc.setFont('Helvetica');
    doc.setFontSize(20);
    doc.text('Currículo', 105, 10, null, null, 'center');

    doc.setFontSize(14);
    let yOffset = 30; // Initial y offset for text positioning

    const addSection = (title, content) => {
      doc.setFontSize(16);
      doc.text(title, 10, yOffset);
      yOffset += 10; // Increment y offset for spacing
      doc.setFontSize(12);
      const splitContent = doc.splitTextToSize(content || '', doc.internal.pageSize.width - 20);
      doc.text(splitContent, 10, yOffset);
      yOffset += splitContent.length * (doc.internal.getLineHeight() / doc.internal.scaleFactor); // Calculate the height of text added
      yOffset += 10; // Add some padding after each section
    };

    addSection('Dados Pessoais', Object.entries(curriculoData.dadosPessoais).map(([key, value]) => `${key}: ${value}`).join('\n'));
    addSection('Objetivo Profissional', curriculoData.objetivoProfissional.descricao || '');
    addSection('Formação Acadêmica', curriculoData.academica.map((a) => `${a.curso} - ${a.instituicao} (${a.periodo})`).join('\n'));
    addSection('Experiência', curriculoData.experiencia.map((e) => `${e.nome} - ${e.cargo}\n${e.funcoes ? e.funcoes.join(', ') : ''}`).join('\n'));
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
