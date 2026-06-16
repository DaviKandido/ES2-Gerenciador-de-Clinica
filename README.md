# 🏥 ES2 — Gerenciador de Clínica

Sistema web para gerenciamento de profissionais de saúde, atendimentos, receitas e exames laboratoriais.

## Visão Geral

O sistema permite cadastrar profissionais de três categorias (Médico, Fisioterapeuta e Psicólogo), registrar atendimentos vinculados a esses profissionais, e emitir receitas de acordo com a especialidade — remédios para médicos, atividades físicas para fisioterapeutas e atividades mentais para psicólogos. Cada atendimento também pode ter exames laboratoriais associados.

---

## Estrutura do Projeto

```
ES2-Gerenciador-de-Clinica/
├── saude-backend/          # API REST — Spring Boot + PostgreSQL
└── saude-frontend/         # Interface web — React + Vite + Tailwind
```

Cada pasta é um repositório independente com seu próprio CI/CD.

---

## Stack

| Camada     | Tecnologia                          |
|------------|-------------------------------------|
| Backend    | Java 17, Spring Boot 3.2, JPA/Hibernate |
| Banco      | PostgreSQL                          |
| Frontend   | React 18, Vite, Tailwind CSS        |
| Testes BE  | JUnit 5, Mockito, MockMvc, H2       |
| Testes FE  | Vitest, Testing Library             |
| CI/CD      | GitHub Actions                      |
| Deploy     | Render (Web Service + Static Site)  |

---

## Rodando Localmente

### Pré-requisitos

- Java 17+
- Maven 3.8+
- Node.js 20+
- PostgreSQL 15+

### 1. Banco de dados

```bash
sudo -u postgres psql << EOF
CREATE USER saude_user WITH PASSWORD 'saude123';
CREATE DATABASE saude OWNER saude_user;
GRANT ALL PRIVILEGES ON DATABASE saude TO saude_user;
EOF
```

### 2. Backend

```bash
cd saude-backend

export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/saude
export SPRING_DATASOURCE_USERNAME=saude_user
export SPRING_DATASOURCE_PASSWORD=saude123

mvn spring-boot:run
# API disponível em http://localhost:8080
```

### 3. Frontend

```bash
cd saude-frontend
npm install
npm run dev
# Interface disponível em http://localhost:5173
```

O Vite faz proxy automático de `/api` → `http://localhost:8080`, então não é necessário configurar CORS manualmente em desenvolvimento.

---

## Testes

```bash
# Backend
cd saude-backend
mvn test

# Frontend
cd saude-frontend
npm test
```

---

## Endpoints da API

### Profissionais de Saúde

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/profissionais` | Listar todos |
| `GET` | `/api/profissionais/{id}` | Buscar por ID |
| `GET` | `/api/profissionais/buscar?nome=X` | Buscar por nome |
| `GET` | `/api/profissionais/categoria/{cat}` | Filtrar por categoria |
| `POST` | `/api/profissionais` | Cadastrar |
| `PUT` | `/api/profissionais/{id}` | Alterar |
| `DELETE` | `/api/profissionais/{id}` | Excluir |

### Atendimentos

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/atendimentos` | Listar todos |
| `GET` | `/api/atendimentos/{id}` | Buscar por ID |
| `GET` | `/api/atendimentos/profissional/{id}` | Por profissional |
| `POST` | `/api/atendimentos` | Registrar |
| `PUT` | `/api/atendimentos/{id}` | Alterar |
| `DELETE` | `/api/atendimentos/{id}` | Excluir |
| `GET` | `/api/atendimentos/{id}/receitas` | Receitas do atendimento |
| `POST` | `/api/atendimentos/{id}/receitas` | Adicionar receita |

### Exames Laboratoriais

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/exames/atendimento/{id}` | Por atendimento |
| `POST` | `/api/exames` | Registrar |
| `PUT` | `/api/exames/{id}` | Alterar |
| `DELETE` | `/api/exames/{id}` | Excluir |

### Regra de Receitas

| Categoria | Tipo de receita permitida |
|-----------|--------------------------|
| `MEDICO` | `REMEDIO` |
| `FISIOTERAPEUTA` | `ATIVIDADE_FISICA` |
| `PSICOLOGO` | `ATIVIDADE_MENTAL` |

Tentar criar uma receita do tipo errado retorna `400 Bad Request`.

---

## Deploy no Render

### Visão geral do fluxo

```
Push na main
    │
    ├── [backend repo] GitHub Actions
    │       ├── mvn test  ✅
    │       └── curl RENDER_DEPLOY_HOOK_URL  → Render rebuild
    │
    └── [frontend repo] GitHub Actions
            ├── npm test  ✅
            ├── npm run build
            └── curl RENDER_DEPLOY_HOOK_FRONTEND_URL  → Render rebuild
```

### Passo a passo — Backend

1. Crie um repositório no GitHub e suba a pasta `saude-backend`
2. No [Render](https://render.com): **New → Web Service**
3. Conecte o repositório, selecione **Docker** como runtime
4. O `render.yaml` na raiz configura tudo automaticamente (serviço + banco PostgreSQL gratuito)
5. Após criar o serviço, copie o **Deploy Hook URL** em: Settings → Deploy Hook
6. No GitHub do repo: **Settings → Secrets → Actions** → adicione:
   - `RENDER_DEPLOY_HOOK_URL` = URL copiada do Render

### Passo a passo — Frontend

1. Crie um repositório no GitHub e suba a pasta `saude-frontend`
2. No Render: **New → Static Site**
3. Conecte o repositório
4. Build command: `npm install && npm run build`
5. Publish directory: `dist`
6. Adicione a env var `VITE_API_URL` com a URL do backend, ex: `https://saude-api.onrender.com/api`
7. Copie o Deploy Hook URL e adicione no GitHub:
   - `RENDER_DEPLOY_HOOK_FRONTEND_URL`
   - `VITE_API_URL`

### Variáveis de ambiente

**Backend (Render preenche automaticamente via `render.yaml`):**

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL de conexão PostgreSQL |
| `PORT` | Porta do servidor (padrão 8080) |

**Frontend:**

| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | URL base da API em produção |

---

## CI/CD — Fluxo detalhado

```
Pull Request aberto
        │
        ▼
  ┌─────────────┐
  │  Testes     │  ← mvn test / npm test
  │  rodam      │
  └──────┬──────┘
         │ falhou? → comentário automático no PR ❌
         │ passou?
         ▼
   PR pode ser mergeado ✅

Push na main
        │
        ▼
  ┌─────────────┐
  │  Testes     │
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │  Build      │  ← só no frontend
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │  Deploy     │  ← curl no Render Deploy Hook
  └─────────────┘
```

---

## Estrutura de Pastas

### Backend

```
saude-backend/
├── src/main/java/com/saude/api/
│   ├── entity/           # Entidades JPA (ProfissionalDeSaude, Atendimento, etc.)
│   ├── repository/       # Interfaces Spring Data JPA
│   ├── service/          # Regras de negócio
│   ├── controller/       # Endpoints REST
│   ├── dto/              # Request/Response records
│   ├── exception/        # Exceções customizadas + handler global
│   └── config/           # CORS
├── src/test/             # Testes unitários e de integração
├── Dockerfile
├── render.yaml
└── pom.xml
```

### Frontend

```
saude-frontend/
├── src/
│   ├── pages/            # Dashboard, Profissionais, Atendimentos, Detalhe
│   ├── components/
│   │   ├── layout/       # Sidebar + Layout principal
│   │   ├── ui/           # Modal, Badge, EmptyState, ConfirmDialog
│   │   ├── profissionais/# FormProfissional
│   │   └── atendimentos/ # FormAtendimento, FormReceita, FormExame
│   ├── services/         # api.js (axios + todos os serviços)
│   └── test/             # Testes com Vitest + Testing Library
├── render.yaml
└── vite.config.js
```

---

## Diagrama de Entidades

```
ProfissionalDeSaude
├── id
├── nome
├── telefone
├── endereco
└── categoria  [MEDICO | FISIOTERAPEUTA | PSICOLOGO]
        │
        │ 1 ────────────── *
        ▼
   Atendimento
   ├── id
   ├── data
   ├── horario
   └── problemaTexto
        │
        ├── * ──── ReceitaSaude (SINGLE_TABLE)
        │          ├── Remedio          (MEDICO)
        │          ├── AtividadeFisica  (FISIOTERAPEUTA)
        │          └── AtividadeMental  (PSICOLOGO)
        │
        └── * ──── ExameLab
                   ├── id
                   ├── descricao
                   └── resultado
```