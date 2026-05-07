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

## 🧠 O Coração da API: Integração com Google Gemini

O grande diferencial deste projeto é a utilização da inteligência artificial **Google Gemini** para transformar dados brutos de treino em consultoria esportiva personalizada.

### Como funciona o fluxo da IA:
1. **Coleta de Dados:** Ao finalizar um treino, o frontend envia para a API todos os "Work Sets" (séries efetivas), contendo o exercício, peso, repetições e o **RIR (Repetições em Reserva)**.
2. **Prompt Engineering:** A API constrói um prompt altamente estruturado que instrui o Gemini a atuar como um "Treinador Especialista em Hipertrofia". 
3. **Análise de Intensidade:** A IA cruza o volume total levantado com a proximidade da falha (RIR). Se o usuário está treinando com um RIR muito alto (ex: 4 ou 5), a IA entende que a intensidade está baixa e sugere aumento de carga.
4. **Retorno Estruturado (JSON):** Forçamos a IA a responder em um formato JSON estrito, o que permite que o sistema processe automaticamente:
    - **Session Score:** Uma nota de 0 a 100 para a qualidade do treino.
    - **Insights Dinâmicos:** Avisos sobre volume excessivo ou progresso excelente.
    - **Próxima Sessão:** Recomendações exatas de carga (ex: "Aumentar para 52.5kg") para garantir a **sobrecarga progressiva**.

### Exemplo de Prompt interno:
```text
Aja como um treinador especialista em hipertrofia.
Analise os seguintes "Work Sets"...
Retorne uma avaliação no formato JSON seguindo estas regras ESTRITAS:
- sessionScore, sessionLabel, nextSession { exercise, target, rir } ...
```

Este feedback é persistido no banco de dados e exibido no histórico do usuário, servindo como um guia para o próximo dia de treino.

---

<img width="1841" height="943" alt="image" src="https://github.com/user-attachments/assets/2ee11917-09e8-4960-8357-da6530c1cfd7" />

---

<img width="1916" height="948" alt="image" src="https://github.com/user-attachments/assets/0b84580f-9cde-4a26-a556-b696c8a220c2" />

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
Este projeto é para fins acadêmicos e de estudo.
