# HyperTrack - Sistema de Gerenciamento de Hipertrofia

HyperTrack é uma aplicação full-stack desenvolvida para auxiliar usuários no acompanhamento de seus treinos, foco em hipertrofia e análise de progresso. O sistema permite o gerenciamento de rotinas de treino, registro de séries, repetições e carga, além de oferecer feedback inteligente utilizando IA.

---

## 📁 Estrutura do Projeto

O repositório está dividido em duas partes principais:
- **API (Servidor):** Localizada na pasta `/server`, desenvolvida em Node.js.
- **Frontend (React):** Localizado na raiz do projeto, desenvolvido com Vite e React.

---

## 🚀 Tecnologias Utilizadas

### Backend (API)
- **Node.js** com **Express**
- **PostgreSQL** (Banco de dados relacional)
- **JWT (JSON Web Token)** para autenticação
- **Bcrypt.js** para criptografia de senhas
- **Google Gemini AI** para análise e feedback de treinos
- **Cors** e **Dotenv**

### Frontend
- **React 19**
- **Vite** (Build tool rápida)
- **Tailwind CSS** (Estilização moderna)
- **Lucide React** (Ícones)
- **Recharts** (Gráficos de evolução)
- **Redux / React-Redux** (Gerenciamento de estado)

---

## 🛠️ Configuração e Instalação

### 1. Pré-requisitos
- Node.js instalado
- PostgreSQL rodando localmente ou em container

### 2. Configuração do Backend (API)

Acesse a pasta do servidor:
```bash
cd server
```

Instale as dependências:
```bash
npm install
```

Configure as variáveis de ambiente. Crie um arquivo `.env` na pasta `/server` com as seguintes chaves:
```env
PORT=3001
DATABASE_URL=postgres://seu_usuario:sua_senha@localhost:5432/hypertrack
JWT_SECRET=sua_chave_secreta_aqui
GEMINI_API_KEY=sua_chave_da_api_gemini
```

Inicie o servidor em modo de desenvolvimento:
```bash
npm run dev
```

> **Nota:** Certifique-se de rodar o arquivo `schema.sql` no seu banco de dados PostgreSQL para criar as tabelas necessárias antes de iniciar.

---

### 3. Configuração do Frontend (React)

Retorne à raiz do projeto:
```bash
cd ..
```

Instale as dependências:
```bash
npm install
```

Inicie a aplicação:
```bash
npm run dev
```

O frontend estará disponível por padrão em `http://localhost:5173`.

---

## 📊 Funcionalidades Principais

1. **Autenticação Segura:** Cadastro e login de usuários com senhas criptografadas.
2. **Gestão de Treinos:** Criação de divisões de treino (ex: Push/Pull/Legs).
3. **Registro de Execução:** Histórico detalhado de séries, repetições e peso utilizado.
4. **Análise por IA:** Integração com Google Gemini para fornecer insights sobre a progressão de carga e volume.
5. **Dashboard Visual:** Gráficos interativos que mostram a evolução do usuário ao longo do tempo.

---

## 📝 Licença
Este projeto é para fins acadêmicos e de estudo (ATIVIDADES FACUL).
