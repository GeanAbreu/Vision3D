# 📦 Catálogo Online de Objetos 3D

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Aplicação web responsiva para exibição e gerenciamento de catálogo online de objetos 3D, com consulta de disponibilidade, simulação de frete e geração de solicitações de compra via WhatsApp.
📑 SumárioVisão GeralPrincipais FuncionalidadesStack TecnológicaArquitetura de SoftwareModelo de DadosComo Executar o Projeto LocalmenteVariáveis de AmbienteEstrutura de PastasLicença🎯 Visão GeralEste projeto consiste em um catálogo online de produtos 3D sem checkout direto. O objetivo principal é apresentar produtos de forma profissional, permitindo que clientes pesquisem itens, consultem estoque e simulem o frete sem a necessidade de criar conta ou realizar pagamentos no site.Ao finalizar a seleção dos produtos, o sistema gera uma mensagem estruturada e direciona o atendimento para o WhatsApp, onde a negociação e a confirmação de pagamento são concluídas fora da plataforma.✨ Principais Funcionalidades🌐 Área Pública (Visitante / Cliente)Navegação e Busca: Pesquisa inteligente por nome, SKU, palavras-chave e filtragem por categorias e disponibilidade.Galeria de Imagens: Suporte para até 10 imagens por produto, com visualização otimizada.Lista de Interesse Local: Adição e gestão de múltiplos produtos sem necessidade de login (dados salvos via localStorage).Simulação de Frete: Cotação automatizada de frete baseada em CEP, peso, dimensões e valor declarado via API do Melhor Envio.Checkout via WhatsApp: Montagem automática de payload contendo lista de itens, quantidades, subtotal e frete estimado.🛡️ Painel Administrativo (Acesso Restrito)Autenticação Segura: Login individual de administradores via Supabase Auth.Gestão de Catálogo (CRUD): Criação, edição, duplicação, ordenação e publicação de produtos e categorias.Controle de Estoque e Auditoria: Registro imutável de entradas, saídas e correções de estoque, indicando o responsável e o motivo.Gestão de Imagens: Upload, validação de formato/tamanho, reordenação e definição de imagem principal.Configurações Comerciais: Edição de número do WhatsApp, CEP de origem, taxa de manuseio e metadados.🛠️ Stack TecnológicaCamadaTecnologiaDescrição / FunçãoFramework WebNext.js (App Router)Renderização híbrida (SSR/SSG), SEO e rotas de servidorLinguagemTypeScriptTipagem estática end-to-end e maior segurança de códigoEstilizaçãoTailwind CSSInterface responsiva, moderna e acessívelBanco de DadosSupabase (PostgreSQL)Persistência de dados relacionais e políticas de acesso (RLS)AutenticaçãoSupabase AuthGerenciamento seguro de sessões de administradoresArmazenamentoSupabase StorageHospedagem e otimização de imagens de produtosAPI de FreteMelhor EnvioIntegração de cotação de frete com múltiplas transportadorasHospedagemVercelDeploy automatizado, CDN global e ambientes de preview🏗️ Arquitetura de SoftwarePlaintext┌─────────────────────────────────────────────────────────┐
│                   Navegador / Cliente                   │
│         (Catálogo Público / Painel Administrativo)       │
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
│    Supabase Ecosystem       │ │    API Melhor Envio    │
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
🔒 Segurança: Todas as operações que usam chaves privilegiadas ou consultam APIs externas são executadas exclusivamente nas Server Routes do Next.js, mantendo os segredos protegidos.🗄️ Modelo de DadosAs principais entidades estruturadas no PostgreSQL via Supabase incluem:products: Informações do produto, SKU, preço, estoque, dimensões e peso logístico.product_images: Galeria de imagens ordenadas vinculadas aos produtos.categories: Organização hierárquica do catálogo.stock_movements: Histórico auditável de movimentação de estoque.site_settings: Configurações gerais (WhatsApp comercial, CEP de origem, políticas).audit_logs: Rastreabilidade de alterações administrativas críticas.🚀 Como Executar o Projeto LocalmentePré-requisitosNode.js v18.x ou superiornpm, pnpm ou yarnUma conta no SupabaseConta Sandbox no Melhor Envio1. Clonar o RepositórioBashgit clone [https://github.com/seu-usuario/catalogo-objetos-3d.git](https://github.com/seu-usuario/catalogo-objetos-3d.git)
cd catalogo-objetos-3d
2. Instalar as DependênciasBashnpm install
3. Configurar Variáveis de AmbienteCrie um arquivo .env.local na raiz do projeto preenchendo as chaves necessárias (veja a seção Variáveis de Ambiente).Bashcp .env.example .env.local
4. Executar as Migrações do Banco de DadosAplique o esquema SQL do banco de dados no seu projeto do Supabase:Bashnpx supabase db push
5. Iniciar o Servidor de DesenvolvimentoBashnpm run dev
Acesse http://localhost:3000 para visualizar a aplicação.🔑 Variáveis de AmbienteO arquivo .env.local deve conter as seguintes variáveis configuradas:Snippet de código# Supabase
NEXT_PUBLIC_SUPABASE_URL=[https://seu-projeto.supabase.co](https://seu-projeto.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-supabase
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-supabase

# API Melhor Envio
MELHOR_ENVIO_TOKEN=seu-token-bearer-melhor-envio
MELHOR_ENVIO_URL=[https://sandbox.melhorenvio.com.br/api/v2](https://sandbox.melhorenvio.com.br/api/v2)

# Configurações do App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
📂 Estrutura de PastasPlaintextcatalogo-objetos-3d/
├── src/
│   ├── app/                  # Rotas públicas e administrativas (App Router)
│   │   ├── (public)/         # Páginas do catálogo, produto, lista de interesse
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
📜 LicençaEste projeto está sob a licença MIT - consulte o arquivo de licença para mais detalhes.
