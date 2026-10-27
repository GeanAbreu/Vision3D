# Vision3D

Aplicação web da Vision3D para apresentação da marca e gerenciamento de um catálogo de produtos. O projeto combina uma interface em React com uma API executada no Cloudflare Workers.

## Tecnologias

- React 18 e TypeScript
- Vite
- Tailwind CSS
- Cloudflare Workers
- Cloudflare D1 para o catálogo
- Cloudflare R2 para imagens dos produtos
- Integração com o Melhor Envio

## Requisitos

- Node.js 18 ou superior
- npm
- Conta na Cloudflare para usar D1, R2 e publicar o projeto

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/GeanAbreu/Vision3D.git
cd Vision3D
npm install
```

## Desenvolvimento

Para executar somente a interface com o Vite:

```bash
npm run dev
```

Nesse modo, o visual da aplicação estará disponível localmente, mas os recursos que dependem da API, do catálogo e do banco D1 não funcionarão por completo.

Para executar a aplicação completa, copie o arquivo de exemplo das variáveis locais:

```powershell
Copy-Item .dev.vars.example .dev.vars
```

Preencha `.dev.vars` com seus valores:

```dotenv
ADMIN_PASSWORD=troque-por-uma-senha-forte
SESSION_SECRET=troque-por-um-segredo-longo-e-aleatorio
MELHOR_ENVIO_TOKEN=cole-o-token-aqui
```

Em seguida, aplique as migrações locais e inicie o Worker:

```bash
npm run db:migrate:local
npm run dev:full
```

> O arquivo `.dev.vars` contém segredos e não deve ser enviado ao Git.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia a interface com o Vite |
| `npm run dev:full` | Compila o frontend e inicia o Worker local |
| `npm run build` | Verifica o TypeScript e gera o build de produção |
| `npm run preview` | Abre uma prévia local do build |
| `npm run db:migrate:local` | Aplica as migrações no D1 local |
| `npm run db:migrate` | Aplica as migrações no D1 remoto |
| `npm run deploy` | Compila e publica no Cloudflare Workers |

## Configuração da Cloudflare

O arquivo `wrangler.jsonc` define:

- o Worker `vision3d-oficial`;
- o banco D1 `vision3d-catalog`;
- o bucket R2 `vision3d-product-images`;
- o CEP de origem usado no cálculo de frete;
- a URL-base da integração com o Melhor Envio.

Antes de publicar, configure os segredos no Cloudflare:

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
npx wrangler secret put MELHOR_ENVIO_TOKEN
```

Depois, aplique as migrações e faça o deploy:

```bash
npm run db:migrate
npm run deploy
```

Consulte [CONFIGURACAO-CLOUDFLARE.md](CONFIGURACAO-CLOUDFLARE.md) para o passo a passo completo.

## Estrutura principal

```text
src/          Interface React
worker/       API do Cloudflare Worker
migrations/   Migrações do banco D1
public/       Imagens e arquivos públicos
```

## Licença

Este repositório não possui uma licença de código aberto definida.
