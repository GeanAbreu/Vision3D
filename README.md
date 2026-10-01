# 📦 Catálogo Online de Objetos 3D

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Aplicação web responsiva para exibição e gerenciamento de catálogo online de objetos 3D, com consulta de disponibilidade, simulação de frete e geração de solicitações de compra via WhatsApp.

## 📑 Sumário

- [Visão Geral](#visão-geral)
- [Principais Funcionalidades](#principais-funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Arquitetura de Software](#arquitetura-de-software)
- [Modelo de Dados](#modelo-de-dados)
- [Como Executar o Projeto Localmente](#como-executar-o-projeto-localmente)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Licença](#licença)

## 🎯 Visão Geral

Este projeto consiste em um catálogo online de produtos 3D sem checkout direto. O objetivo principal é apresentar produtos de forma profissional, permitindo que clientes pesquisem itens, consultem estoque e simulem o frete sem a necessidade de criar conta ou realizar pagamentos no site.

Ao finalizar a seleção dos produtos, o sistema gera uma mensagem estruturada e direciona o atendimento para o WhatsApp, onde a negociação e a confirmação de pagamento são concluídas fora da plataforma.

## ✨ Principais Funcionalidades

### 🌐 Área Pública (Visitante / Cliente)

- **Navegação e busca:** pesquisa inteligente por nome, SKU e palavras-chave, além de filtragem por categorias e disponibilidade.
- **Galeria de imagens:** suporte para até 10 imagens por produto, com visualização otimizada.
- **Lista de interesse local:** adição e gestão de múltiplos produtos sem necessidade de login, com dados salvos via `localStorage`.
- **Simulação de frete:** cotação automatizada de frete baseada em CEP, peso, dimensões e valor declarado via API do Melhor Envio.
- **Checkout via WhatsApp:** montagem automática de payload contendo lista de itens, quantidades, subtotal e frete estimado.

### 🛡️ Painel Administrativo (Acesso Restrito)

- **Autenticação segura:** login individual de administradores via Supabase Auth.
- **Gestão de catálogo (CRUD):** criação, edição, duplicação, ordenação e publicação de produtos e categorias.
- **Controle de estoque e auditoria:** registro imutável de entradas, saídas e correções de estoque, indicando o responsável e o motivo.
- **Gestão de imagens:** upload, validação de formato e tamanho, reordenação e definição de imagem principal.
- **Configurações comerciais:** edição de número do WhatsApp, CEP de origem, taxa de manuseio e metadados.

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Descrição / Função |
| --- | --- | --- |
| Framework web | Next.js (App Router) | Renderização híbrida (SSR/SSG), SEO e rotas de servidor |
| Linguagem | TypeScript | Tipagem estática end-to-end e maior segurança de código |
| Estilização | Tailwind CSS | Interface responsiva, moderna e acessível |
| Banco de dados | Supabase (PostgreSQL) | Persistência de dados relacionais e políticas de acesso (RLS) |
| Autenticação | Supabase Auth | Gerenciamento seguro de sessões de administradores |
| Armazenamento | Supabase Storage | Hospedagem e otimização de imagens de produtos |
| API de frete | Melhor Envio | Integração de cotação de frete com múltiplas transportadoras |
| Hospedagem | Vercel | Deploy automatizado, CDN global e ambientes de preview |

## 🏗️ Arquitetura de Software

```text
┌─────────────────────────────────────────────────────────┐
│                   Navegador / Cliente                   │
│         (Catálogo Público / Painel Administrativo)      │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 Next.js (Server Actions / API)          │
│        • Revalidação de Preço e Estoque                 │
│        • Validação de Payload e Autenticação            │
└──────────────┬───────────────────────────┬──────────────┘
               │                           │
               ▼                           ▼
┌─────────────────────────────┐ ┌─────────────────────────┐
│    Supabase Ecosystem       │ │    API Melhor Envio     │
│  • PostgreSQL DB (RLS)      │ │  • Cotação de Frete     │
│  • Supabase Auth            │ └─────────────────────────┘
│  • Storage (Imagens)        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│    Redirecionamento para    │
│       WhatsApp Web/App      │
└─────────────────────────────┘
```

> 🔒 **Segurança:** todas as operações que usam chaves privilegiadas ou consultam APIs externas são executadas exclusivamente nas Server Routes do Next.js, mantendo os segredos protegidos.

## 🗄️ Modelo de Dados

As principais entidades estruturadas no PostgreSQL via Supabase incluem:

- `products`: informações do produto, SKU, preço, estoque, dimensões e peso logístico.
- `product_images`: galeria de imagens ordenadas vinculadas aos produtos.
- `categories`: organização hierárquica do catálogo.
- `stock_movements`: histórico auditável de movimentação de estoque.
- `site_settings`: configurações gerais, como WhatsApp comercial, CEP de origem e políticas.
- `audit_logs`: rastreabilidade de alterações administrativas críticas.

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

- Node.js v18.x ou superior;
- npm, pnpm ou Yarn;
- uma conta no Supabase;
- uma conta Sandbox no Melhor Envio.

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/catalogo-objetos-3d.git
cd catalogo-objetos-3d
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto, preenchendo as chaves necessárias. Consulte a seção [Variáveis de Ambiente](#variáveis-de-ambiente).

```bash
cp .env.example .env.local
```

### 4. Executar as migrações do banco de dados

Aplique o esquema SQL do banco de dados no seu projeto do Supabase:

```bash
npx supabase db push
```

### 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para visualizar a aplicação.

## 🔑 Variáveis de Ambiente

O arquivo `.env.local` deve conter as seguintes variáveis configuradas:

```dotenv
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-supabase
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-supabase

# API Melhor Envio
MELHOR_ENVIO_TOKEN=seu-token-bearer-melhor-envio
MELHOR_ENVIO_URL=https://sandbox.melhorenvio.com.br/api/v2

# Configurações do App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Nunca inclua valores reais de credenciais ou tokens no controle de versão. Mantenha somente exemplos sem dados sensíveis em `.env.example`.

## 📂 Estrutura de Pastas

```text
catalogo-objetos-3d/
├── src/
│   ├── app/                  # Rotas públicas e administrativas (App Router)
│   │   ├── (public)/         # Páginas do catálogo, produto e lista de interesse
│   │   ├── admin/            # Dashboard, gestão de produtos e estoque
│   │   └── api/              # Endpoints para cotação de frete e webhooks
│   ├── components/           # Componentes UI reutilizáveis (cards, formulários)
│   ├── lib/                  # Clientes e utilitários (Supabase, Melhor Envio)
│   ├── types/                # Interfaces e tipos TypeScript
│   └── actions/              # Server Actions do Next.js
├── supabase/
│   ├── migrations/           # Scripts SQL de schema e políticas RLS
│   └── seed.sql              # Dados iniciais para ambiente de teste
├── public/                   # Arquivos estáticos (favicons, logos)
├── .env.example              # Modelo de variáveis de ambiente
├── tailwind.config.ts        # Configurações do Tailwind CSS
└── README.md                 # Documentação do projeto
```

## 📜 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
