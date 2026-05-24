# Campus Notify — Frontend

Interface web do Campus Notify: gestão de alunos, grupos, tarefas acadêmicas e notificações via WhatsApp.

## Requisitos

- Node.js 20+
- Backend rodando em `http://localhost:8080` (ou URL configurada)

## Configuração

Copie o arquivo de ambiente e ajuste se necessário:

```bash
cp .env.example .env.local
```

| Variável        | Descrição                          | Padrão                  |
|-----------------|------------------------------------|-------------------------|
| `VITE_API_URL`  | URL base da API (Spring Boot)      | `http://localhost:8080` |

## Scripts

```bash
npm install
npm run dev      # desenvolvimento (Vite)
npm run build    # build de produção
npm run preview  # preview do build
npm run lint     # ESLint
```

## Estrutura

```
src/
  components/   # Layout, AuthPanel, UI reutilizável
  contexts/     # Auth, confirmações globais
  pages/        # Telas da aplicação
  routes/       # Rotas públicas/privadas
  services/     # Chamadas à API (axios)
```

## Autenticação

A API usa cookies de sessão (`withCredentials: true`). Se a sessão expirar (401), o usuário é redirecionado para o login automaticamente.

## Rotas principais

| Rota            | Descrição        |
|-----------------|------------------|
| `/`             | Login            |
| `/register`     | Cadastro         |
| `/home`         | Dashboard        |
| `/alunos`       | Alunos           |
| `/grupos`       | Grupos           |
| `/vinculos`     | Vínculos         |
| `/tarefas`      | Tarefas          |
| `/notificacoes` | Notificações     |
| `/whatsapp`     | Teste WhatsApp   |
