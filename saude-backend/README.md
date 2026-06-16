# Saúde API — Spring Boot + PostgreSQL

API REST para gestão de profissionais de saúde, atendimentos, receitas e exames laboratoriais.

## Stack
- Java 17 + Spring Boot 3.2
- PostgreSQL
- Docker
- GitHub Actions CI/CD
- Deploy no Render

## Endpoints

### Profissionais de Saúde
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/profissionais` | Listar todos |
| GET | `/api/profissionais/{id}` | Buscar por ID |
| GET | `/api/profissionais/buscar?nome=X` | Buscar por nome |
| GET | `/api/profissionais/categoria/{categoria}` | Filtrar por categoria (MEDICO, FISIOTERAPEUTA, PSICOLOGO) |
| POST | `/api/profissionais` | Inserir |
| PUT | `/api/profissionais/{id}` | Alterar |
| DELETE | `/api/profissionais/{id}` | Excluir |

### Atendimentos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/atendimentos` | Listar todos |
| GET | `/api/atendimentos/{id}` | Buscar por ID |
| GET | `/api/atendimentos/profissional/{id}` | Por profissional |
| POST | `/api/atendimentos` | Inserir |
| PUT | `/api/atendimentos/{id}` | Alterar |
| DELETE | `/api/atendimentos/{id}` | Excluir |
| GET | `/api/atendimentos/{id}/receitas` | Receitas do atendimento |
| POST | `/api/atendimentos/{id}/receitas` | Adicionar receita |

### Exames Laboratoriais
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/exames/atendimento/{id}` | Por atendimento |
| POST | `/api/exames` | Inserir |
| PUT | `/api/exames/{id}` | Alterar |
| DELETE | `/api/exames/{id}` | Excluir |

## Regra de Receitas
- **MEDICO** → só pode criar receitas do tipo `REMEDIO`
- **FISIOTERAPEUTA** → só pode criar `ATIVIDADE_FISICA`
- **PSICOLOGO** → só pode criar `ATIVIDADE_MENTAL`

## Como rodar localmente

```bash
# Com Docker
docker build -t saude-api .
docker run -e DATABASE_URL=jdbc:postgresql://localhost:5432/saude -p 8080:8080 saude-api

# Sem Docker
export DATABASE_URL=jdbc:postgresql://localhost:5432/saude
mvn spring-boot:run
```

## Testes
```bash
mvn test
```

## Deploy no Render

1. Suba o código no GitHub
2. No Render: **New Web Service** → conecte o repo
3. Adicione o secret `RENDER_DEPLOY_HOOK_URL` no GitHub (Settings → Secrets)
4. O `render.yaml` cuida do resto automaticamente

## Variáveis de Ambiente (Render)
| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL de conexão PostgreSQL (preenchida automaticamente pelo Render) |
| `PORT` | Porta da aplicação (padrão: 8080) |
