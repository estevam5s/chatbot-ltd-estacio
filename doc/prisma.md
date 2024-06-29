## Configurando Prisma
1
. Adicione Prisma ao seu projeto

- Execute o seguinte comando para adicionar o Prisma e o Prisma Client ao seu projeto:

```bash
npm install @prisma/client
npm install prisma --save-dev
```

2. Inicialize o Prisma

- Execute o seguinte comando para inicializar o Prisma:

```bash
npx prisma init
```

- Isso criará um diretório prisma contendo um arquivo `schema.prisma`.

3. Configure seu schema Prisma

- Edite o arquivo prisma/schema.prisma para incluir o modelo User:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
}
```

4. Atualize a URL do Banco de Dados no `.env`

- Abra o arquivo .env e substitua a URL do banco de dados local pela URL do seu banco de dados hospedado:

```bash
DATABASE_URL="postgresql://neondb_owner:hx1of6XgiBKz@ep-odd-bar-a5w7gqy0.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

5. Crie a migração
Execute o seguinte comando para criar a migração:

```bash
npx prisma migrate dev --name init
```

6. Atualize package.json para incluir o comando de build do Vercel

- Adicione o seguinte script no seu package.json:

```json
"scripts": {
  "vercel-build": "npx prisma migrate deploy && react-scripts build",
  ...
}
```

7. Configure o Prisma Client

Crie um arquivo prisma.js para inicializar o Prisma Client:

```js
// src/prisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

8. Atualize o componente de Login

- Atualize o componente Login para salvar os dados no banco de dados:

```js
import React, { useState } from 'react';
import '../estilos/login.css';
import logo from '../img/logocr.png';
import iconEmail from '../img/icongmail.png';
import iconPassword from '../img/iconpassworld.png';
import iconGoogle from '../img/icongoogle.png';
import { Link } from 'react-router-dom';
import prisma from '../prisma'; // Importe o Prisma Client

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await prisma.user.create({
        data: {
          email,
          password
        }
      });
      alert('User registered successfully!');
    } catch (error) {
      console.error(error);
      alert('An error occurred while registering the user.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="email"
              placeholder="Email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <img src={iconEmail} alt="Email" className="iconemail" />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img src={iconPassword} alt="Password" className="iconpassword" />
          </div>
          <button type="submit" className="sign-in-button">Sign In</button>
        </form>
        <div className="google-sign-in">
          <img src={iconGoogle} alt="Google Sign In" />
        </div>
        <p className="register-prompt">
          You don't have an account? <Link to="/cadastro" className="register-link">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
```

## Configurações Adicionais

Adicione DATABASE_URL ao seu arquivo .env no Vercel:
Certifique-se de adicionar a variável DATABASE_URL ao seu ambiente no Vercel. Vá para as configurações do seu projeto no Vercel, vá para a seção de variáveis de ambiente e adicione DATABASE_URL.

Certifique-se de que o Prisma Client é construído durante o deploy:
O comando npx prisma migrate deploy irá garantir que as migrações sejam aplicadas durante o processo de deploy.

Atualize seu servidor para lidar com solicitações:
Se você estiver utilizando um servidor como Express, você precisará configurar as rotas para lidar com as solicitações de login e registro. Certifique-se de importar o Prisma Client no servidor.

Agora, ao fazer o deploy no Vercel, o Prisma deve ser configurado corretamente e o script vercel-build deve garantir que as migrações sejam aplicadas antes do build do React.
