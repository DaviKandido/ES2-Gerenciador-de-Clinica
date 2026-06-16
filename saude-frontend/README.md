# Saúde Frontend — React + Vite + Tailwind

Interface web para o sistema de gerenciamento de clínica.

## Stack
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- React Hook Form
- Axios
- React Hot Toast
- Vitest + Testing Library

## Como rodar

```bash
npm install
npm run dev
```
Acesse: http://localhost:5173

## Testes
```bash
npm test
```

## Build produção
```bash
npm run build
```

## Deploy no Render

1. Suba no GitHub
2. Render → **New Static Site** → conecte o repo
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Adicione env var `VITE_API_URL` com a URL do backend no Render
6. Adicione secret `RENDER_DEPLOY_HOOK_FRONTEND_URL` no GitHub

## Variáveis de Ambiente
| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | URL base da API backend |
# teste
# teste
# teste
