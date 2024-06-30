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
  { question: 'Vamos falar agora sobre a sua carreira, podemos dar continuidade?', key: 'resposta', section: 'resposta' },
  { question: 'Qual é o nome da empresa em que trabalha ou já trabalhou?', key: 'empresa', section: 'experiencia' },
  { question: 'Qual era o cargo ocupado ou que ocupa atualmente?', key: 'trabalho', section: 'experiencia' },
  { question: 'Quanto tempo você ficou trabalhando ou ainda trabalha?', key: 'duracao', section: 'experiencia' },
  { question: 'Descreva uma função que você desenpenha ou que já desempenhou.', key: 'descricao', section: 'experiencia' },
  { question: 'Descreva uma outra função.', key: 'Sdescricao', section: 'experiencia' },
  { question: 'Agora falaremos sobre as suas certificações, podemos começar?', key: 'resposta', section: 'resposta' },
  { question: 'Qual é o nome do seu certificado?', key: 'nome', section: 'certificacoes' },
  { question: 'Qual é o curso relacionado ao certificado?', key: 'curso', section: 'certificacoes' },
  { question: 'Qual é a instituição emissora do certificado?', key: 'instituicao', section: 'certificacoes' },
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
        const parts = line.split(': ');
        if (parts.length === 2 && (parts[0].toLowerCase().includes('e-mail') || parts[0].toLowerCase().includes('linkedin'))) {
          doc.text(parts[0] + ': ', 10, yOffset);
          doc.setTextColor(0, 0, 255); // Azul para links e emails
          doc.text(parts[1].trim(), 10 + doc.getTextWidth(parts[0] + ': '), yOffset);
          doc.setTextColor(0, 0, 0); // Preto para o restante
        } else {
          doc.text(line, 10, yOffset);
        }
        yOffset += doc.internal.getLineHeight() / doc.internal.scaleFactor;
      });
      yOffset += 10;
    };

    const formatAcademica = (academica) => {
      return academica.map((item, index) => {
        return `Curso: ${item.curso}\n` +
        `Instituição: ${item.instituicao}\n` +
        `Total de semestres: ${item.periodo}\n` +
        `Status do curso: ${item.statusAtual}\n` +
        `Fase atual: ${item.faseAtual}`;
      }).join('\n\n');
    };

    const formatExperiencia = (experiencia) => {
      return experiencia.map((item, index) => {
        return `Empresa: ${item.empresa}\n` +
        `Cargo: ${item.trabalho}\n` +
        `Duração: ${item.duracao}\n` +
        `Função: ${item.descricao}\n` +
        `Outra função: ${item.Sdescricao}`;
      }).join('\n\n');
    };

    // eslint-disable-next-line no-unused-vars
    const formatCertificacoes = (certificacoes) => {
      return certificacoes.map((item, index) => {
        return `Certificado: ${item.nome}\nCurso: ${item.curso}\nInstituição: ${item.instituicao}`;
      }).join('\n\n');
    };

    // eslint-disable-next-line no-unused-vars
    const formatIdiomas = (idiomas) => {
      return idiomas.map((item, index) => {
        return `Idioma: ${item.lingua}\nFluência: ${item.fluencia}\nOutro Idioma: ${item.lingua2}\nFluência no segundo idioma: ${item.fluencia2}`;
      }).join('\n\n');
    };

    addSection('Dados Pessoais', Object.entries(curriculoData.dadosPessoais).filter(([key]) => key !== 'cliente').map(([key, value]) => `${key}: ${value}`).join('\n'));
    addSection('Objetivo Profissional', curriculoData.objetivoProfissional.descricao || '');
    addSection('Formação Acadêmica', formatAcademica(curriculoData.academica));
    addSection('Experiência', formatExperiencia(curriculoData.experiencia));
    addSection('Certificações', curriculoData.certificacoes.map((c) => `${c.nome} - ${c.curso} (${c.instituicao})`).join('\n'));
    addSection('Idiomas', curriculoData.idiomas.map((i) => `${i.lingua}: ${i.fluencia}\n${i.lingua2}: ${i.fluencia2}`).join('\n'));
    doc.save('curriculo.pdf');

    doc.save(`${nomePessoa}.pdf`);
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
