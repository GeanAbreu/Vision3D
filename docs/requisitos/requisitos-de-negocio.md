# Requisitos de Negócio

## 1. Contexto

O Catálogo Online de Objetos 3D deve apresentar os produtos da Vision 3D, apoiar o atendimento comercial e manter informações confiáveis de preço e estoque. O produto não substitui a negociação: no MVP, a solicitação é encaminhada ao WhatsApp, e pagamento, confirmação do frete e fechamento da venda acontecem fora da plataforma.

## 2. Objetivos de negócio

### ON-001 — Disponibilizar catálogo público profissional

Apresentar os objetos 3D de forma organizada, acessível em dispositivos móveis e adequada à divulgação comercial da Vision 3D.

**Indicadores sugeridos:**

- percentual de produtos ativos com descrição, preço e imagem principal completos;
- visualizações de produtos publicados;
- taxa de visitantes que adicionam ao menos um produto à lista de interesse.

### ON-002 — Reduzir atrito no início do atendimento

Permitir que o visitante pesquise, selecione produtos e estime o frete sem criar uma conta.

**Indicadores sugeridos:**

- tempo mediano entre entrada no catálogo e abertura do WhatsApp;
- taxa de abandono da lista de interesse;
- taxa de sucesso das simulações de frete.

### ON-003 — Melhorar a qualidade das solicitações comerciais

Enviar ao atendimento uma mensagem estruturada com produtos, quantidades e valores vigentes, reduzindo perguntas repetitivas e divergências.

**Indicadores sugeridos:**

- percentual de solicitações com todos os itens identificados por SKU;
- ocorrências de divergência de preço ou indisponibilidade após a solicitação;
- tempo médio até a confirmação comercial.

### ON-004 — Manter estoque rastreável

Garantir que entradas, saídas e correções sejam registradas por administradores e possam ser auditadas.

**Indicadores sugeridos:**

- divergência entre estoque físico e saldo registrado;
- percentual de movimentações com justificativa válida;
- quantidade de correções por período.

### ON-005 — Consolidar um projeto profissional de portfólio

Manter arquitetura, documentação, testes, histórico Git e implantação com qualidade demonstrável.

**Indicadores sugeridos:**

- percentual de Pull Requests aprovados nos checks obrigatórios;
- cobertura das regras críticas;
- documentação atualizada por entrega relevante.

## 3. Requisitos e regras de negócio

### RN-001 — Ausência de cadastro de clientes

O cliente não deve criar conta nem autenticar-se para consultar o catálogo, manter uma lista de interesse, simular frete ou iniciar contato comercial no MVP.

**Justificativa:** reduzir barreiras de entrada e evitar coleta desnecessária de dados pessoais.

### RN-002 — Catálogo sem checkout online

O site deve funcionar como catálogo e canal de geração de solicitações, não como comércio eletrônico com checkout ou pagamento online.

**Implicações:**

- o sistema não captura pagamento;
- não existe pedido confirmado automaticamente;
- a conclusão da venda ocorre no atendimento comercial.

### RN-003 — Preço fixo por produto

Cada produto deve possuir um único preço de venda vigente no MVP.

**Implicações:**

- não existem tabelas de preço por cliente;
- não existem preços por variante;
- promoções automáticas e cupons ficam fora do escopo inicial.

### RN-004 — Características sem variações selecionáveis

Cor, tamanho, material e demais características devem constar na descrição do produto, sem combinações ou variações selecionáveis no MVP.

**Implicações:** qualquer combinação comercialmente distinta deve ser cadastrada como produto próprio ou tratada durante o atendimento.

### RN-005 — Identificação única por SKU

Todo produto deve possuir um SKU único e estável para identificação no catálogo, estoque e comunicação comercial.

**Implicações:**

- dois produtos não podem compartilhar o mesmo SKU;
- o SKU deve acompanhar os itens na mensagem enviada ao WhatsApp;
- alterações de SKU devem ser auditáveis quando o produto já possuir histórico.

### RN-006 — Publicação condicionada à validade

Somente produtos com dados comerciais e logísticos mínimos válidos podem ser publicados.

**Dados mínimos:**

- nome;
- SKU único;
- descrição;
- preço fixo maior que zero;
- imagem principal;
- peso e dimensões válidos para o frete;
- categoria aplicável.

### RN-007 — Visibilidade pública controlada

Produtos despublicados não devem aparecer em listagens, pesquisas, filtros ou páginas públicas acessíveis pelo fluxo normal.

**Implicações:** despublicar um produto não apaga seu histórico de estoque ou auditoria.

### RN-008 — Limite de imagens

Cada produto pode possuir no máximo dez imagens e exatamente uma delas deve ser a principal quando o produto for publicado.

**Implicações:** a ordem das imagens deve ser mantida e a remoção da imagem principal exige a definição de outra quando necessário.

### RN-009 — Lista de interesse local

A lista de interesse deve ser mantida no navegador do visitante e não representa pedido, reserva ou compromisso de compra.

**Implicações:**

- a lista pode deixar de existir se os dados locais forem apagados;
- seu conteúdo deve ser revalidado antes da solicitação;
- não há sincronização entre dispositivos no MVP.

### RN-010 — Quantidade válida

A quantidade de um item deve ser inteira, positiva e limitada ao estoque disponível no momento da validação.

**Implicações:** valores fracionários, zero e quantidades negativas são inválidos.

### RN-011 — Revalidação comercial obrigatória

Imediatamente antes de gerar a mensagem do WhatsApp, o servidor deve revalidar publicação, preço, estoque e quantidade de todos os produtos.

**Implicações:**

- o navegador não é fonte confiável para valores comerciais;
- divergências devem ser apresentadas ao visitante;
- a mensagem só pode ser gerada após a lista voltar a um estado válido.

### RN-012 — Solicitação sem reserva automática

Adicionar um produto à lista, gerar uma mensagem, abrir o WhatsApp ou enviar a mensagem não reserva e não reduz estoque.

**Justificativa:** essas ações demonstram interesse, mas não confirmam a venda.

### RN-013 — Saída após confirmação comercial

A saída de estoque deve ocorrer somente após confirmação comercial e deve ser registrada por um administrador autorizado.

**Implicações:**

- a operação deve informar quantidade e motivo ou referência comercial;
- o saldo não pode ficar negativo;
- a saída deve ser rastreável ao responsável.

### RN-014 — Movimentação imutável

Entradas, saídas e correções de estoque devem formar um histórico imutável pela operação administrativa comum.

**Implicações:**

- erros são corrigidos por nova movimentação, não pela edição destrutiva do registro anterior;
- cada movimentação registra produto, tipo, quantidade, responsável, data e motivo;
- o saldo deve ser derivável ou conciliável a partir do histórico.

### RN-015 — Correção de estoque justificada

Toda correção manual de estoque deve exigir uma justificativa e registrar os saldos anterior e posterior.

**Justificativa:** preservar a capacidade de auditoria e investigação de divergências.

### RN-016 — Estimativa de frete

O valor e o prazo apresentados pelo cálculo de frete são estimativas e devem ser confirmados durante o atendimento.

**Implicações:**

- a interface e a mensagem comercial devem indicar o caráter estimado;
- falha na cotação não autoriza o uso de um valor inventado;
- o atendimento pode revisar a estimativa antes da venda.

### RN-017 — Base logística do frete

A cotação deve considerar CEP de origem configurado, CEP de destino informado, peso, dimensões, quantidade, valor declarado e eventual taxa de manuseio definida comercialmente.

**Implicações:** dados logísticos inválidos impedem uma estimativa confiável.

### RN-018 — Segredo da integração de frete

O token do Melhor Envio deve permanecer no servidor e nunca pode ser exposto ao navegador ou incorporado a conteúdo público.

**Implicações:** todas as chamadas autenticadas ao serviço devem passar por rotas ou ações de servidor.

### RN-019 — Composição da mensagem comercial

A mensagem gerada deve conter, no mínimo, identificação dos produtos, SKUs, quantidades, preços revalidados, subtotal, frete estimado selecionado e total estimado.

**Implicações:** a mensagem deve declarar que disponibilidade, frete e fechamento dependem de confirmação no atendimento.

### RN-020 — Número comercial configurável

O destino do WhatsApp deve ser obtido das configurações comerciais administráveis, e não ficar duplicado em diferentes partes do código.

**Implicações:** somente administradores autorizados podem alterar o número.

### RN-021 — Acesso administrativo restrito

Somente administradores autenticados e autorizados podem manter produtos, categorias, imagens, estoque, configurações e registros administrativos.

**Implicações:** autorização deve ser aplicada no servidor e no banco quando aplicável.

### RN-022 — Responsabilidade administrativa individual

Cada administrador deve utilizar uma identidade individual para que ações críticas sejam atribuídas corretamente.

**Implicações:** contas compartilhadas não devem ser adotadas como prática operacional.

### RN-023 — Auditoria de alterações críticas

Alterações em preço, publicação, estoque, permissões e configurações comerciais devem gerar registros de auditoria.

**Conteúdo mínimo do registro:**

- ação executada;
- entidade afetada;
- responsável;
- data e hora;
- valores anterior e posterior quando aplicável.

### RN-024 — Armazenamento de imagens

Os arquivos de imagem devem ficar no Supabase Storage, enquanto o banco mantém seus endereços, ordem, texto alternativo e metadados relevantes.

**Justificativa:** separar arquivos binários dos dados relacionais e facilitar sua entrega otimizada.

### RN-025 — Moeda e idioma

Toda informação destinada ao público deve utilizar português do Brasil, e valores monetários devem ser expressos em real brasileiro.

### RN-026 — Exclusão com preservação histórica

Produtos, categorias ou usuários relacionados a registros históricos não devem ser apagados de forma que comprometa movimentações ou auditorias.

**Implicações:** arquivamento, desativação ou exclusão lógica devem ser preferidos quando houver dependências históricas.

## 4. Políticas comerciais a definir antes da produção

Os itens abaixo exigem decisão explícita do responsável pelo negócio e não devem ser presumidos durante a implementação:

### PC-001 — Política de taxa de manuseio

Definir se a taxa será fixa, percentual ou inexistente, além de como aparecerá para o cliente.

### PC-002 — Política de produtos sem estoque

Definir se produtos esgotados permanecerão visíveis, poderão integrar lista de interesse ou aceitarão consulta de disponibilidade.

### PC-003 — Prazo de confirmação comercial

Definir por quanto tempo uma condição informada no atendimento será considerada válida antes de nova conferência de preço e estoque.

### PC-004 — Cancelamento e devolução

Documentar as regras comerciais e legais aplicáveis a cancelamento, troca, devolução e produtos personalizados antes do início das vendas.

### PC-005 — Embalagem e restrições logísticas

Definir critérios de consolidação de volumes, limites de dimensões, regiões atendidas e alternativas quando o Melhor Envio não retornar modalidade.

## 5. Escopo do MVP

### Incluído

- catálogo público pesquisável e filtrável;
- detalhes e galeria de produtos;
- lista de interesse local;
- estimativa de frete;
- mensagem e redirecionamento para WhatsApp;
- autenticação administrativa;
- gestão de catálogo, categorias e imagens;
- controle e auditoria de estoque;
- configurações comerciais essenciais.

### Fora do escopo

- cadastro e área do cliente;
- checkout e pagamento online;
- pedido confirmado automaticamente;
- reserva automática de estoque;
- variações selecionáveis de produto;
- cupons, promoções e programas de fidelidade;
- sincronização da lista entre dispositivos;
- emissão fiscal e integração contábil;
- gestão completa de transporte após a venda.

## 6. Rastreabilidade resumida

| Tema | Requisitos |
| --- | --- |
| Modelo comercial do MVP | RN-001 a RN-004 |
| Catálogo e conteúdo | RN-005 a RN-008 |
| Lista e validação | RN-009 a RN-012 |
| Estoque | RN-013 a RN-015 |
| Frete | RN-016 a RN-018 |
| WhatsApp | RN-019 e RN-020 |
| Administração e auditoria | RN-021 a RN-023 |
| Dados, idioma e histórico | RN-024 a RN-026 |
