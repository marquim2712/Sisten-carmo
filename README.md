## Tech Track Guard — Guia de Configuração e Deploy (Vercel)

### Requisitos

- Node.js e npm instalados
- Conta na Vercel
- Projeto Supabase (URL e Anon Key)

### Instalação local

```sh
npm i
npm run dev
```

### Configuração de variáveis (.env)

Este projeto usa Vite; apenas variáveis com prefixo `VITE_` ficam disponíveis no frontend.

Crie um arquivo `.env` na raiz (já ignorado pelo Git) com:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Em seguida, reinicie o servidor de desenvolvimento (`npm run dev`).

### Integração Supabase

O cliente Supabase está em `src/integrations/supabase/client.ts` e lê as variáveis acima via `import.meta.env`.

### SPA fallback (React Router) na Vercel

Para evitar 404 em rotas client-side, crie um `vercel.json` na raiz do projeto:

```json
{
  "rewrites": [
    { "source": "/((?!assets/|favicon.ico|robots.txt).*)", "destination": "/index.html" }
  ]
}
```

### Deploy na Vercel (painel)

1. Suba o repositório para GitHub/GitLab/Bitbucket
2. Acesse a Vercel > New Project > importe o repositório
3. Framework: Vite (auto-detectado)
4. Build Command: `vite build` (ou `npm run build`)
5. Output Directory: `dist`
6. Em Project Settings > Environment Variables, adicione:
   - `VITE_SUPABASE_URL` = URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY` = Anon key pública do Supabase
7. Salve e faça o Deploy

Cada push na branch configurada gera novo deploy.

### Deploy com Vercel CLI (opcional)

```sh
npm i -g vercel
vercel                # inicializa o projeto
vercel deploy         # deploy de preview
vercel deploy --prod  # deploy de produção
```

Se usar CLI, defina as envs via painel antes do `--prod` ou use `vercel env add`.

### Checklist de problemas comuns

- Erro: `Uncaught Error: supabaseKey is required`
  - As variáveis não estão disponíveis no runtime do navegador.
  - Confirme o nome exato das variáveis: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
  - No local, verifique `.env` e reinicie `npm run dev`.
  - Na Vercel, adicione/ajuste em Project Settings > Environment Variables e faça novo deploy.
  - No console do navegador, teste:
    - `import.meta.env.VITE_SUPABASE_URL` deve retornar sua URL

- Rotas quebrando (404) em produção
  - Falta do `vercel.json` com rewrite para SPA. Adicione o arquivo conforme seção acima e redeploy.

### Scripts úteis

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### Tecnologias

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
