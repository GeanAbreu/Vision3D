# 📦 Catálogo Online de Objetos 3D

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Aplicação web para exibição e gerenciamento de catálogo online de objetos 3D, com consulta de disponibilidade, simulação de frete e geração de solicitações estruturadas via WhatsApp.
🎯 Objetivo do ProjetoOferecer um canal comercial leve e responsivo para apresentação profissional do portfólio de produtos 3D. O sistema opera no modelo de catálogo sem checkout, onde o cliente seleciona os itens de interesse, calcula a estimativa de frete e finaliza o atendimento diretamente no WhatsApp da empresa.✨ Principais Funcionalidades🌐 Área Pública (Cliente)Busca e Filtros: Pesquisa por nome, SKU, palavras-chave e categorias.Galeria de Imagens: Suporte a até 10 fotos otimizadas por produto.Lista de Interesse: Agrupamento de múltiplos itens salvo localmente (localStorage).Cotação de Frete: Integração em tempo real com a API do Melhor Envio via servidor.Integração WhatsApp: Geração automática de mensagem pré-formatada contendo itens, quantidades, subtotal e frete estimado.🛡️ Painel Administrativo (Protegido)Autenticação Segura: Login individual com Supabase Auth.Gestão de Produtos (CRUD): Cadastro de atributos, dimensões, pesos logísticos e status de publicação.Controle de Estoque: Registro auditável de movimentações (entradas, saídas e correções).Gestão de Mídia: Upload, reordenação e seleção de imagem principal.Configurações Gerais: Gerenciamento do número do WhatsApp, CEP de origem e informações comerciais.🛠️ Stack TecnológicaCamadaTecnologiaDescriçãoFramework WebNext.js (App Router) + TypeScriptSSR/SSG, rotas de API seguras e tipagem estáticaEstilizaçãoTailwind CSSInterface responsiva e acessívelBanco de DadosSupabase PostgreSQLPersistência de dados, triggers e políticas RLSAutenticaçãoSupabase AuthAutenticação dos administradoresStorageSupabase StorageArmazenamento e otimização de imagensIntegração LogísticaMelhor Envio APICálculo em tempo real de preço e prazo de entregaHospedagemVercelDeploy contínuo, CDN e ambientes de Preview🏗️ Arquitetura e Fluxo de Dados[ Navegador / Cliente ]
       │
       ▼
[ Next.js Server Routes ] ────► [ API Melhor Envio ] (Cotação de Frete)
       │
       ├────► [ Supabase Auth ] (Sessões e Acesso)
       ├────► [ Supabase DB ]   (Produtos, Estoque, Logs)
       └────► [ Supabase Storage ] (Galeria de Imagens)
       │
       ▼
[ WhatsApp Web/App ] (Redirecionamento com Payload Pré-formatado)
Nota de Segurança: Todas as credenciais de API e operações críticas de validação de preço e estoque ocorrem estritamente no lado do servidor (Server Actions / API Routes).🚀 Como Executar o Projeto LocalmentePré-requisitosNode.js >= 18.xnpm, pnpm ou yarnConta configurada no Supabase e Melhor Envio Sandbox1. Clonar o repositórioBashgit clone [https://github.com/seu-usuario/catalogo-objetos-3d.git](https://github.com/seu-usuario/catalogo-objetos-3d.git)
cd catalogo-objetos-3d
2. Instalar as dependênciasBashnpm install
3. Configurar Variáveis de AmbienteCrie um arquivo .env.local na raiz do projeto baseado no .env.example:Snippet de código# Supabase
NEXT_PUBLIC_SUPABASE_URL=[https://seu-projeto.supabase.co](https://seu-projeto.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico

# Melhor Envio API
MELHOR_ENVIO_TOKEN=seu-token-api
MELHOR_ENVIO_URL=[https://sandbox.melhorenvio.com.br/api/v2](https://sandbox.melhorenvio.com.br/api/v2)

# Configurações do App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
4. Executar as Migrações do Banco de DadosAlique o esquema e as políticas de segurança diretamente no Supabase ou via CLI:Bashnpx supabase db push
5. Iniciar o Servidor de DesenvolvimentoBashnpm run dev
Acesse http://localhost:3000 no seu navegador.📂 Estrutura de PastasPlaintext├── src/
│   ├── app/                 # Rotas do Next.js App Router (Públicas e Admin)
│   ├── components/          # Componentes de UI reutilizáveis
│   ├── lib/                 # Utilitários, clientes de API (Supabase, Melhor Envio)
│   ├── types/               # Definições de tipos TypeScript
│   └── actions/             # Server Actions para revalidação e mutações
├── supabase/
│   ├── migrations/          # Scripts SQL do modelo de dados e RLS
│   └── seed.sql             # Dados de teste para ambiente local
├── public/                  # Arquivos estáticos e marca
└── README.md
📄 LicençaEste projeto está sob a licença MIT.
