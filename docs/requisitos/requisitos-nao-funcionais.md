# Requisitos Não Funcionais

## 1. Objetivo

Este documento define os atributos de qualidade, restrições técnicas e critérios operacionais do Catálogo Online de Objetos 3D. Os requisitos devem orientar arquitetura, implementação, testes, implantação e operação do produto.

## 2. Segurança e privacidade

### RNF-001 — Proteção de credenciais

Tokens, chaves privadas, credenciais de banco e segredos de produção devem permanecer exclusivamente no servidor e em mecanismos seguros de variáveis de ambiente.

**Critérios de verificação:**

- nenhum segredo real é versionado;
- somente variáveis explicitamente públicas usam o prefixo `NEXT_PUBLIC_`;
- `.env.local` e equivalentes reais são ignorados pelo Git;
- o repositório mantém apenas um `.env.example` sem valores sensíveis.

### RNF-002 — Autorização em múltiplas camadas

Operações administrativas devem validar autorização no servidor e, quando aplicável, por políticas Row Level Security (RLS) no banco.

**Critérios de verificação:**

- ocultar controles no navegador não é considerado mecanismo de autorização;
- requisições sem sessão válida recebem resposta de acesso negado;
- tabelas administrativas possuem políticas coerentes com os perfis autorizados.

### RNF-003 — Validação de entrada

Dados recebidos de formulários, parâmetros de rota, APIs e armazenamento local devem ser validados no servidor antes do uso ou persistência.

**Critérios de verificação:**

- entradas inválidas retornam erros controlados;
- preço, estoque e totais não são aceitos diretamente do navegador;
- consultas ao banco utilizam mecanismos que evitem injeção.

### RNF-004 — Segurança de sessão

Sessões administrativas devem utilizar os mecanismos seguros do Supabase Auth e cookies com atributos apropriados ao ambiente.

**Critérios de verificação:**

- encerramento de sessão invalida o acesso administrativo;
- páginas protegidas não expõem conteúdo sensível durante redirecionamentos;
- credenciais não são registradas em logs.

### RNF-005 — Upload seguro de imagens

Uploads devem ser limitados a formatos, tamanhos e quantidades permitidos e armazenados fora do banco relacional.

**Critérios de verificação:**

- tipo declarado e conteúdo do arquivo são validados;
- nomes de arquivo não são usados sem normalização;
- arquivos rejeitados não ficam disponíveis publicamente;
- o limite de dez imagens por produto é aplicado no servidor.

### RNF-006 — Minimização de dados pessoais

O MVP não deve exigir cadastro nem armazenar dados pessoais do visitante para permitir a consulta ao catálogo e a criação da lista de interesse.

**Critérios de verificação:**

- navegação, lista e simulação de frete não exigem conta de cliente;
- somente dados necessários ao fluxo solicitado são processados;
- logs evitam registrar dados pessoais ou comerciais restritos.

## 3. Desempenho e eficiência

### RNF-007 — Desempenho das páginas públicas

As páginas públicas devem oferecer carregamento rápido em dispositivos móveis e conexões comuns no Brasil.

**Metas iniciais:**

- Largest Contentful Paint (LCP) de até 2,5 segundos no percentil 75;
- Interaction to Next Paint (INP) de até 200 milissegundos no percentil 75;
- Cumulative Layout Shift (CLS) de até 0,1 no percentil 75.

As metas devem ser verificadas em produção ou ambiente representativo com dados reais de uso.

### RNF-008 — Otimização de imagens

Imagens de produtos devem ser entregues em dimensões e formatos apropriados ao contexto de exibição.

**Critérios de verificação:**

- imagens fora da área visível utilizam carregamento adiado quando apropriado;
- dimensões são reservadas para evitar deslocamento de layout;
- miniaturas não transferem desnecessariamente o arquivo em resolução máxima.

### RNF-009 — Eficiência de consultas

Listagens, pesquisas e filtros devem utilizar paginação e índices adequados ao volume esperado.

**Critérios de verificação:**

- a interface não depende da carga integral do catálogo para pesquisar;
- consultas frequentes são analisadas antes da produção;
- problemas de consulta não expõem detalhes internos ao visitante.

### RNF-010 — Cache e atualização

Conteúdo público pode utilizar cache e renderização estática, desde que alterações de preço, publicação e disponibilidade sejam invalidadas de forma controlada.

**Critérios de verificação:**

- atualizações administrativas relevantes disparam revalidação;
- a mensagem do WhatsApp nunca é gerada somente com dados potencialmente obsoletos do cache;
- respostas privadas não são armazenadas em cache público.

## 4. Disponibilidade e resiliência

### RNF-011 — Falhas de serviços externos

Indisponibilidade ou lentidão do Melhor Envio não deve impedir a consulta ao catálogo ou causar falha geral da aplicação.

**Critérios de verificação:**

- a integração possui tempo limite definido;
- erros são traduzidos para mensagens compreensíveis;
- o visitante pode tentar novamente sem perder a lista de interesse;
- o sistema não inventa preço ou prazo quando não houver resposta válida.

### RNF-012 — Integridade transacional do estoque

Atualizações de saldo e criação da movimentação correspondente devem ocorrer de forma atômica.

**Critérios de verificação:**

- falha parcial não altera apenas uma das partes;
- operações concorrentes não permitem saldo negativo;
- correções mantêm rastreabilidade do saldo anterior.

### RNF-013 — Recuperação de erros

Fluxos críticos devem tratar estados de carregamento, vazio, sucesso e erro sem deixar a interface em estado inconsistente.

**Critérios de verificação:**

- ações repetidas são prevenidas ou tratadas de forma idempotente quando necessário;
- mensagens indicam como o usuário pode prosseguir;
- erros inesperados são registrados para diagnóstico sem expor segredos.

### RNF-014 — Backup e recuperação

Dados persistidos e imagens devem seguir uma política documentada de backup e recuperação compatível com o ambiente de produção.

**Critérios de verificação:**

- frequência, retenção e responsáveis são definidos antes da produção;
- o processo de restauração é testado periodicamente;
- migrations possuem estratégia de avanço e rollback quando aplicável.

## 5. Usabilidade e acessibilidade

### RNF-015 — Responsividade

A aplicação deve funcionar em celulares, tablets e computadores sem perda de funcionalidade essencial.

**Critérios de verificação:**

- não há rolagem horizontal acidental nas larguras suportadas;
- ações principais permanecem acessíveis por toque;
- imagens e tabelas se adaptam ao espaço disponível.

### RNF-016 — Acessibilidade

As interfaces devem buscar conformidade com WCAG 2.2 nível AA nos fluxos essenciais.

**Critérios de verificação:**

- toda funcionalidade essencial é operável por teclado;
- foco visível e ordem de foco coerente são mantidos;
- campos possuem rótulos e erros associados;
- imagens informativas possuem texto alternativo;
- contraste de texto e controles atende ao nível AA.

### RNF-017 — Linguagem e formatação

Todo conteúdo destinado ao usuário deve ser apresentado em português do Brasil, com preços em real brasileiro e terminologia comercial consistente.

**Critérios de verificação:**

- valores monetários utilizam `pt-BR` e `BRL`;
- mensagens de erro evitam jargões técnicos;
- datas e medidas seguem formato compreensível ao público brasileiro.

### RNF-018 — Feedback de interação

Operações assíncronas devem apresentar feedback claro e impedir ações duplicadas quando houver risco.

**Critérios de verificação:**

- botões indicam processamento;
- sucesso e falha são comunicados;
- a interface preserva dados válidos após erro recuperável.

## 6. Compatibilidade

### RNF-019 — Navegadores suportados

A aplicação deve suportar as duas versões estáveis mais recentes de Chrome, Edge, Firefox e Safari, incluindo navegadores móveis baseados em Chromium e Safari.

**Critérios de verificação:**

- os fluxos públicos essenciais são testados em pelo menos um navegador Chromium e um WebKit;
- recursos sem suporte possuem degradação controlada;
- a abertura do WhatsApp considera ambientes móveis e desktop.

### RNF-020 — Integração com WhatsApp

A URL gerada deve seguir o formato aceito pelo WhatsApp e respeitar limites práticos de codificação e tamanho.

**Critérios de verificação:**

- caracteres especiais e quebras de linha são codificados corretamente;
- a mensagem permanece legível nos ambientes suportados;
- falha ao abrir o aplicativo não altera estoque nem dados persistentes.

## 7. Manutenibilidade e qualidade

### RNF-021 — TypeScript estrito

O projeto deve utilizar TypeScript em modo estrito e tipos explícitos nas fronteiras com banco, APIs, formulários e variáveis de ambiente.

**Critérios de verificação:**

- a verificação de tipos é executada na integração contínua;
- o uso de `any` exige justificativa excepcional;
- respostas externas são validadas antes de receber tipos internos confiáveis.

### RNF-022 — Organização do código

O código deve manter separação clara entre interface, regras de domínio, acesso a dados e integrações externas, sem abstrações antecipadas sem benefício demonstrável.

**Critérios de verificação:**

- segredos e clientes privilegiados não são importados por componentes de navegador;
- regras críticas são testáveis sem depender da interface;
- decisões arquiteturais relevantes são registradas em `docs/decisions/`.

### RNF-023 — Testabilidade

Regras de preço, publicação, estoque, quantidade, frete e autorização devem possuir testes automatizados proporcionais ao risco.

**Critérios de verificação:**

- testes cobrem caminhos válidos, limites e falhas;
- integrações externas podem ser substituídas por respostas controladas nos testes;
- correções de defeitos relevantes incluem teste de regressão.

### RNF-024 — Integração contínua

Todo Pull Request deve executar, quando os scripts estiverem disponíveis, instalação reproduzível, lint, formatação, tipos, testes e build de produção.

**Critérios de verificação:**

- falha em check obrigatório impede integração;
- jobs possuem nomes estáveis e claros;
- o processo não depende de segredos de produção para validar contribuições comuns.

### RNF-025 — Documentação

Configuração local, variáveis de ambiente, arquitetura, banco, implantação e decisões relevantes devem permanecer documentadas e coerentes com o código.

**Critérios de verificação:**

- novas variáveis são adicionadas ao `.env.example` e à documentação;
- migrations e mudanças incompatíveis incluem instruções de atualização;
- documentação destinada ao usuário permanece em português do Brasil.

## 8. Observabilidade e auditoria

### RNF-026 — Logs estruturados

O sistema deve registrar falhas e eventos operacionais relevantes com contexto suficiente para diagnóstico, sem incluir segredos ou dados sensíveis desnecessários.

**Critérios de verificação:**

- logs diferenciam ambiente, severidade e origem;
- erros de integrações incluem identificador de correlação quando disponível;
- tokens, credenciais e conteúdo sensível são removidos ou mascarados.

### RNF-027 — Rastreabilidade administrativa

Ações críticas devem ser atribuíveis a um administrador e protegidas contra alteração comum.

**Critérios de verificação:**

- registros incluem responsável e data;
- movimentações de estoque são imutáveis pela interface comum;
- acesso aos registros respeita autorização administrativa.

## 9. Implantação e operação

### RNF-028 — Ambientes isolados

Desenvolvimento, preview e produção devem utilizar configurações e credenciais separadas.

**Critérios de verificação:**

- previews não utilizam credenciais de produção sem necessidade formalmente aprovada;
- o sandbox do Melhor Envio é usado fora de produção;
- URLs e chaves são configuradas por ambiente.

### RNF-029 — Implantação controlada

A implantação em produção deve ocorrer a partir da `main` estável, após aprovação dos checks definidos.

**Critérios de verificação:**

- mudanças entram na `main` por Pull Request;
- o processo de rollback é documentado;
- migrations são avaliadas antes da implantação.

### RNF-030 — Dependências suportadas

Dependências devem utilizar versões suportadas e receber atualizações controladas, acompanhadas de validação de compatibilidade e segurança.

**Critérios de verificação:**

- o arquivo de lock é versionado;
- instalação reproduzível é usada na CI;
- vulnerabilidades relevantes são avaliadas antes de releases.

## 10. Matriz de atributos de qualidade

| Atributo | Requisitos |
| --- | --- |
| Segurança e privacidade | RNF-001 a RNF-006 |
| Desempenho | RNF-007 a RNF-010 |
| Disponibilidade e resiliência | RNF-011 a RNF-014 |
| Usabilidade e acessibilidade | RNF-015 a RNF-018 |
| Compatibilidade | RNF-019 e RNF-020 |
| Manutenibilidade e qualidade | RNF-021 a RNF-025 |
| Observabilidade e auditoria | RNF-026 e RNF-027 |
| Implantação e operação | RNF-028 a RNF-030 |
