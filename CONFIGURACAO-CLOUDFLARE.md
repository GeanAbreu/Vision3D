# Configuração da Vision3D na Cloudflare

## 1. Instalar e entrar na Cloudflare

```powershell
npm install
npx wrangler login
```

## 2. Criar o banco gratuito

```powershell
npx wrangler d1 create vision3d-catalog
```

Copie o `database_id` exibido e substitua `SUBSTITUA_PELO_ID_DO_D1` no arquivo `wrangler.jsonc`.

## 3. Criar as tabelas

```powershell
npm run db:migrate
```

## 4. Configurar os segredos

Execute os comandos abaixo. O terminal pedirá cada valor sem mostrá-lo na tela.

```powershell
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
npx wrangler secret put MELHOR_ENVIO_TOKEN
```

- `ADMIN_PASSWORD`: senha usada para entrar em `/admin`.
- `SESSION_SECRET`: texto aleatório longo, diferente da senha.
- `MELHOR_ENVIO_TOKEN`: token gerado no Melhor Envio.

Edite também `ORIGIN_CEP` no `wrangler.jsonc` com o CEP de onde os produtos serão enviados.

## 5. Publicar

```powershell
npm run deploy
```

O endereço gratuito `workers.dev` será exibido no terminal.

## Desenvolvimento local completo

Copie `.dev.vars.example` para `.dev.vars`, preencha os valores e execute:

```powershell
npm run db:migrate:local
npm run dev:full
```

O Vite isolado (`npm run dev`) mostra o visual, mas as operações do catálogo dependem do Worker e do D1.
