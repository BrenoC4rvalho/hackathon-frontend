# 📋 Ficha de Acompanhamento e Diagnóstico do Projeto

> **Orientações para a Equipe:** Este documento deve ser preenchido pela equipe para alinhar as expectativas do projeto com os mentores e organizadores. Sejam diretos, honestos e realistas nas respostas.

---

## 🏛️ 1. Identificação da Equipe

- **Nome da Equipe:** CampusNotify
- **Nome dos Integrantes e Períodos:**
  - Thomas Santana da Silva — 6° período
  - Iasmin De Oliveira Dias Lage — 6° período
  - Sarah Kamilly Silva Pereira — 6° período
  - Yanna Íssila Vianna — 6° período
  - Breno Caravalho de Oliveira 6°período
- **Link do Repositório (GitHub):**
  - Frontend: https://github.com/BrenoC4rvalho/hackathon-frontend
  - Backend: https://github.com/BrenoC4rvalho/hackathon-backend
- **Link do Deploy:**
  - Frontend: https://campus-notify.vercel.app/
  - Backend: https://hackathon-backend-bx5y.onrender.com
- **Link do Rascunho/Design (Figma):** Não utilizado

---

## 💡 2. O Problema e a Proposta de Valor (O Coração da Ideia)

### 2.1. Qual problema real e específico vocês estão resolvendo?

> Professores e coordenadores enfrentam dificuldade em comunicar tarefas, prazos e notificações acadêmicas de forma ágil e centralizada para grupos de alunos. A comunicação fragmentada gera atrasos, perdas de informação e baixo engajamento dos estudantes.

### 2.2. O diferencial da solução está claro? O que torna a ideia de vocês única?

> O Campus Notify centraliza o gerenciamento de tarefas acadêmicas e envia notificações automáticas via **WhatsApp** diretamente para os alunos cadastrados nos grupos. Diferente de e-mails ou portais acadêmicos que os alunos raramente acessam, o WhatsApp garante que a mensagem chegue no canal que eles já usam no dia a dia.

---

## ⚙️ 3. A Solução na Prática (Como Funciona)

### 3.1. Como a solução funciona para o usuário final?

> 1. O professor cria sua conta e faz login na plataforma
> 2. Cadastra grupos de alunos com seus respectivos contatos
> 3. Cria tarefas acadêmicas associadas a um grupo (título, descrição, prazo, tipo)
> 4. O sistema envia notificações automáticas via WhatsApp para todos os alunos do grupo
> 5. O professor acompanha o histórico de notificações enviadas pelo painel

### 3.2. Quais são as principais tecnologias, linguagens ou ferramentas que decidiram usar?

> - **Frontend:** React + TypeScript + Vite + Tailwind CSS — hospedado na Vercel
> - **Backend:** Java com Spring Boot 3 + Spring Security + JWT — hospedado no Render
> - **Banco de Dados:** PostgreSQL com Flyway para migrations
> - **Mensageria:** Twilio WhatsApp API para envio de notificações
> - **Autenticação:** JWT (Bearer Token)

---

## 👥 4. Gestão e Divisão de Trabalho

### 4.1. Quem está fazendo o quê na equipe?

- **Breno & Yanna:** Desenvolvimento do Backend (APIs REST, banco de dados, autenticação, integração Twilio)
- **Iasmin:** Desenvolvimento do Frontend (interfaces, componentes, integração com a API)
- **Thomas:** Configuração de rotas backend/frontend
- **Sarah:** Criação dos slides e preparação da apresentação

---

## 🛠️ 5. Status Atual do Desenvolvimento (O MVP)

### 5.1. Vocês já começaram o protótipo visual ou o código do MVP? Qual o percentual de conclusão estimado?

- **Status:** (x) **Projeto concluído — 100% pronto para entrega**

### 5.2. O projeto já funciona em alguma parte? O que já está codificado e operacional?

> O projeto está **completamente funcional em produção**:
> - Cadastro e login de usuários com autenticação JWT
> - Gerenciamento de alunos, grupos e vínculos
> - Criação e listagem de tarefas acadêmicas
> - Envio de notificações via WhatsApp (Twilio)
> - Histórico de notificações
> - Deploy no Vercel (frontend) e Render (backend) com PostgreSQL

### 5.3. O que foi ou será "Mockado" (dados fictícios/estáticos)?

> Nenhuma parte do sistema é mockada. Todos os dados são reais, persistidos em banco de dados PostgreSQL, e as notificações são enviadas de fato via WhatsApp.

### 5.4. O que ainda falta finalizar obrigatoriamente para a entrega?

> Nada. O projeto está finalizado e em produção.

---

## 🚧 6. Obstáculos e Pedidos de Ajuda

### 6.1. Qual maior dificuldade da equipe?

> A maior dificuldade foi na **configuração das rotas** do frontend — garantir que as rotas privadas (autenticadas) e públicas funcionassem corretamente, incluindo o redirecionamento após login e a sincronização do estado de autenticação com o contexto global da aplicação.

---

## 🎤 7. Preparação para o Show (O Pitch)

### 7.1. Como será a estratégia de apresentação de vocês na segunda-feira?

> **Apresentadora:** Sarah Kamilly Silva Pereira
>
> A apresentação será feita com **demonstração ao vivo do sistema** em produção (https://campus-notify.vercel.app/), mostrando o fluxo completo: login, cadastro de grupo, criação de tarefa e recebimento da notificação via WhatsApp em tempo real.
