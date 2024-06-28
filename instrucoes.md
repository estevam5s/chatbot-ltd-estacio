Para hospedar tanto o backend Flask quanto o frontend React juntos no Vercel, você precisa configurar um projeto monorepo ou um projeto combinado que contenha tanto o backend quanto o frontend. Vou fornecer um guia passo a passo para configurar e fazer o deploy desse tipo de projeto.

### Estrutura do Projeto 

Aqui está a estrutura sugerida para o projeto:


```bash
/my-project
  /frontend
    /public
    /src
    package.json
  /backend
    /app
      __init__.py
      routes.py
    /static
    /templates
    app.py
    requirements.txt
  .gitignore
  vercel.json
```

### Passos para Configuração 

#### 1. Configurar o Frontend (React) 
Já temos o frontend React configurado. Certifique-se de que ele esteja na pasta `/frontend`.
#### 2. Configurar o Backend (Flask) 
Crie a estrutura do backend na pasta `/backend`.**
Para hospedar tanto o backend Flask quanto o frontend React juntos no Vercel, você precisa configurar um projeto monorepo ou um projeto combinado que contenha tanto o backend quanto o frontend. Vou fornecer um guia passo a passo para configurar e fazer o deploy desse tipo de projeto.

### Estrutura do Projeto 

Aqui está a estrutura sugerida para o projeto:


```bash
/my-project
  /frontend
    /public
    /src
    package.json
  /backend
    /app
      __init__.py
      routes.py
    /static
    /templates
    app.py
    requirements.txt
  .gitignore
  vercel.json
```

### Passos para Configuração 

#### 1. Configurar o Frontend (React) 
Já temos o frontend React configurado. Certifique-se de que ele esteja na pasta `/frontend`.
#### 2. Configurar o Backend (Flask) 
Crie a estrutura do backend na pasta `/backend`.`backend/app.py`** 

```python
from flask import Flask, send_from_directory
from flask_socketio import SocketIO, emit
from fpdf import FPDF

app = Flask(__name__, static_folder='../frontend/build', static_url_path='')
socketio = SocketIO(app, cors_allowed_origins="*")

# Variável global para armazenar os dados do currículo
curriculo_data = {
    'dadosPessoais': {},
    'objetivoProfissional': {},
    'academica': [],
    'experiencia': [],
    'certificacoes': [],
    'idiomas': []
}

steps = [
    {'question': 'Qual é o seu email?', 'key': 'email'},
    {'question': 'Qual é o seu telefone?', 'key': 'telefone'},
    {'question': 'Qual é a sua cidade?', 'key': 'cidade'},
    {'question': 'Qual é a sua data de nascimento?', 'key': 'dataNascimento'},
    {'question': 'Descreva seu objetivo profissional.', 'key': 'descricao', 'section': 'objetivoProfissional'},
    {'question': 'Qual é o seu curso?', 'key': 'curso', 'section': 'academica', 'index': 0},
    {'question': 'Qual é a instituição de ensino?', 'key': 'instituicao', 'section': 'academica', 'index': 0},
    {'question': 'Qual é o período do curso?', 'key': 'periodo', 'section': 'academica', 'index': 0},
    {'question': 'Qual é o status atual do curso?', 'key': 'statusAtual', 'section': 'academica', 'index': 0},
    {'question': 'Qual é a fase atual do curso?', 'key': 'faseAtual', 'section': 'academica', 'index': 0},
    {'question': 'Qual é o nome da empresa em que trabalhou?', 'key': 'nome', 'section': 'experiencia', 'index': 0},
    {'question': 'Qual era o cargo ocupado?', 'key': 'cargo', 'section': 'experiencia', 'index': 0},
    {'question': 'Descreva uma função que você desempenhou.', 'key': 'funcao1', 'section': 'experiencia', 'index': 0, 'subkey': 'funcoes'},
    {'question': 'Descreva outra função que você desempenhou.', 'key': 'funcao2', 'section': 'experiencia', 'index': 0, 'subkey': 'funcoes'},
    {'question': 'Qual é o nome do seu certificado?', 'key': 'nome', 'section': 'certificacoes', 'index': 0},
    {'question': 'Qual é o curso relacionado ao certificado?', 'key': 'curso', 'section': 'certificacoes', 'index': 0},
    {'question': 'Qual é a instituição emissora do certificado?', 'key': 'instituicao', 'section': 'certificacoes', 'index': 0},
    {'question': 'Qual idioma você fala?', 'key': 'lingua', 'section': 'idiomas', 'index': 0},
    {'question': 'Qual é o seu nível de fluência no idioma?', 'key': 'fluencia', 'section': 'idiomas', 'index': 0},
]

class PDF(FPDF):
    def header(self):
        self.set_font("Arial", 'B', 16)
        self.cell(0, 10, 'Currículo', 0, 1, 'C')
        self.ln(10)

    def section_title(self, title):
        self.set_font("Arial", 'B', 12)
        self.set_text_color(0, 0, 128)
        self.cell(0, 10, title + ":", 0, 1, 'L')
        self.ln(2)

    def section_body(self, text):
        self.set_font("Arial", '', 8)
        self.set_text_color(0, 0, 0)
        self.multi_cell(0, 10, text)
        self.ln(2)

    def add_section(self, title, content):
        self.section_title(title)
        self.section_body(content)
        self.ln(5)

def generate_pdf(data):
    pdf = PDF()
    pdf.add_page()
    pdf.add_section("Dados Pessoais", "\n".join([f"{key.capitalize()}: {value}" for key, value in data["dadosPessoais"].items()]))
    pdf.add_section("Certificações", "\n".join([f"{cert['nome']}\n{cert['curso']}\n{cert['instituicao']}" for cert in data["certificacoes"]]))
    pdf.add_section("Idiomas", "\n".join([f"{idioma['lingua']}: {idioma['fluencia']}" for idioma in data["idiomas"]]))
    experiencia_content = "\n".join([
        f"{empresa['nome']} - {empresa['cargo']}\n" +
        "\n".join([f"{funcao}" for funcao in empresa["funcoes"]])
        for empresa in data["experiencia"]
    ])
    pdf.add_section("Experiência", experiencia_content)
    pdf.add_section("Formação Acadêmica", "\n".join([f"{form['curso']}\n{form['instituicao']}\n{form['periodo']}\n{form['statusAtual']}, {form['faseAtual']}" for form in data["academica"]]))
    pdf.add_section("Objetivo Profissional", data["objetivoProfissional"]["descricao"])
    pdf_file = "/curriculos/curriculo.pdf"
    pdf.output(pdf_file)
    return pdf_file

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@socketio.on('connect')
def handle_connect():
    emit('message', {'text': 'Olá! Vamos criar seu currículo. Qual é o seu email?'})

@socketio.on('message')
def handle_message(data):
    global curriculo_data
    if 'dadosPessoais' not in curriculo_data:
        curriculo_data['dadosPessoais'] = {}
    if 'current_step' not in curriculo_data:
        curriculo_data['current_step'] = 0
    step = steps[curriculo_data['current_step']]
    if 'section' in step:
        section = step['section']
        if section not in curriculo_data:
            curriculo_data[section] = [{}]
        if 'index' in step:
            index = step['index']
            if index >= len(curriculo_data[section]):
                curriculo_data[section].append({})
            if 'subkey' in step:
                subkey = step['subkey']
                if subkey not in curriculo_data[section][index]:
                    curriculo_data[section][index][subkey] = []
                curriculo_data[section][index][subkey].append(data['text'])
            else:
                curriculo_data[section][index][step['key']] = data['text']
        else:
            curriculo_data[section][step['key']] = data['text']
    else:
        curriculo_data['dadosPessoais'][step['key']] = data['text']
    curriculo_data['current_step'] += 1
    if curriculo_data['current_step'] < len(steps):
        next_step = steps[curriculo_data['current_step']]
        emit('message', {'text': next_step['question']})
    else:
        emit('message', {'text': 'Obrigado por fornecer todas as informações! Clique no link abaixo para baixar seu currículo.'})
        emit('complete', {'link': '/download'})

@app.route('/download')
def download_curriculo():
    pdf_file = generate_pdf(curriculo_data)
    return send_file(pdf_file, as_attachment=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
```
`backend/requirements.txt`** 

```txt
Flask
flask-socketio
fpdf
```
3. Configurar o `vercel.json`Configure o arquivo `vercel.json` na raiz do projeto para incluir as configurações de build e API.`vercel.json`** 

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/app.py",
      "use": "@vercel/python"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/app.py"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

#### 4. Configurar o Build do React 
Certifique-se de que o `package.json` do React está configurado corretamente para build.`frontend/package.json`** 

```json
{
  "name": "cria",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

#### 5. Fazer o Deploy no Vercel 
 
1. Adicione todos os arquivos e mudanças ao git:


```sh
git add .
git commit -m "Setup Flask and React deployment on Vercel"
```
 
2. Push para o repositório:


```sh
git push origin main
```
 
3. Configure o projeto no Vercel e ligue ao repositório GitHub. O Vercel automaticamente detectará o `vercel.json` e configurará os builds para o frontend e backend.

Agora, seu projeto deve ser configurado para servir tanto o backend Flask quanto o frontend React a partir do Vercel. Se você seguir esses passos, seu aplicativo estará disponível com backend e frontend funcionando juntos.