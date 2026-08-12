Ponto Estágio — scaffold MVP (Next.js + TypeScript + Prisma)

Setup rápido:

1) Copie os arquivos para um diretório e instale:
   npm install

2) Configure .env com DATABASE_URL e JWT_SECRET (veja .env.example).

3) Rodar migração inicial e gerar client:
   npx prisma migrate dev --name init
   (isso cria as tabelas no seu Postgres)

4) Rodar em dev:
   npm run dev
   Abra http://localhost:3000

Fluxo básico:
- POST /api/auth/register -> { name, email, password }
- POST /api/auth/login -> { email, password } retorna { token }
- Autenticar requests adicionando header: Authorization: Bearer <token>
- POST /api/punches -> { type: "IN"|"OUT" }
- GET  /api/punches -> lista do usuário autenticado

Observações e próximos passos sugeridos:
- Substituir auth por NextAuth ou Supabase Auth para SSO/SSO institucional.
- Adicionar validações de jornada (não permitir OUT sem IN).
- Armazenamento de fotos -> usar storage (Supabase/Cloud) e salvar URL.
- Painel admin com filtros, export CSV.
- Produção: HTTPS, variáveis seguras, policies de CORS, rate limiting, testes.

Se quiser que eu:
- crie o repo no seu GitHub e faça o push (me passe owner/repo),
- ou adicione autenticação via NextAuth + Google/Institutional SSO,
- ou gere a feature de foto + geolocalização,
posso implementar na sequência.
