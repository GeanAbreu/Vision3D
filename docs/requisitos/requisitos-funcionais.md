# Requisitos Funcionais

## 1. Objetivo

Este documento descreve as funcionalidades esperadas para o Catálogo Online de Objetos 3D. O MVP disponibiliza um catálogo público sem cadastro de clientes, um painel administrativo protegido, controle de estoque, estimativa de frete e geração de solicitações comerciais pelo WhatsApp.

## 2. Atores

| Ator | Responsabilidade |
| --- | --- |
| Visitante | Consultar o catálogo, selecionar produtos, estimar o frete e iniciar uma solicitação pelo WhatsApp |
| Administrador | Manter catálogo, categorias, imagens, estoque e configurações comerciais |
| Serviço de frete | Retornar modalidades, prazos e preços estimados de entrega |
| WhatsApp | Receber a mensagem comercial gerada pelo sistema |

## 3. Catálogo público

### RF-001 — Listar produtos publicados

O sistema deve exibir ao visitante somente os produtos publicados, apresentando ao menos imagem principal, nome, preço e situação de disponibilidade.

**Critérios de aceite:**

- produtos não publicados não aparecem na área pública;
- a listagem informa quando não houver produtos disponíveis;
- preços são exibidos em real brasileiro.

### RF-002 — Pesquisar produtos

O sistema deve permitir a pesquisa de produtos por nome, SKU e palavras-chave relevantes.

**Critérios de aceite:**

- a pesquisa considera apenas produtos publicados;
- o resultado é atualizado de acordo com o termo informado;
- uma mensagem de resultado vazio é exibida quando não houver correspondências.

### RF-003 — Filtrar o catálogo

O sistema deve permitir filtrar produtos por categoria e disponibilidade.

**Critérios de aceite:**

- filtros podem ser combinados;
- o visitante pode limpar os filtros aplicados;
- os resultados permanecem restritos a produtos publicados.

### RF-004 — Visualizar detalhes do produto

O sistema deve disponibilizar uma página de detalhes com nome, SKU, descrição, preço, disponibilidade, imagens e informações necessárias ao cálculo de frete.

**Critérios de aceite:**

- produtos inexistentes ou não publicados não têm detalhes públicos expostos;
- características como cor, tamanho e material são exibidas na descrição;
- não são oferecidas variações selecionáveis no MVP.

### RF-005 — Navegar pela galeria de imagens

O sistema deve permitir visualizar a imagem principal e a galeria ordenada de cada produto, limitada a dez imagens.

**Critérios de aceite:**

- a imagem principal recebe destaque;
- imagens alternativas podem ser selecionadas;
- textos alternativos são disponibilizados para as imagens.

## 4. Lista de interesse

### RF-006 — Adicionar produto à lista de interesse

O visitante deve poder adicionar um produto publicado e disponível à lista de interesse sem realizar login.

**Critérios de aceite:**

- o visitante informa uma quantidade inteira e positiva;
- a quantidade solicitada não pode exceder o estoque validado;
- adicionar novamente o mesmo produto atualiza sua quantidade, sem criar item duplicado.

### RF-007 — Gerenciar a lista de interesse

O visitante deve poder consultar, alterar a quantidade e remover itens da lista de interesse.

**Critérios de aceite:**

- o subtotal de cada item e o total da lista são recalculados após alterações;
- a lista é persistida localmente no navegador;
- a interface contempla os estados vazio, válido e inválido.

### RF-008 — Revalidar a lista no servidor

Antes de gerar uma solicitação comercial, o sistema deve revalidar no servidor os produtos, preços, publicação, estoque e quantidades.

**Critérios de aceite:**

- divergências são comunicadas ao visitante;
- valores enviados pelo navegador não são tratados como fonte confiável;
- a geração da mensagem é impedida enquanto houver item inválido.

## 5. Frete

### RF-009 — Solicitar dados para estimativa de frete

O sistema deve permitir que o visitante informe o CEP de destino para simular o frete dos itens da lista de interesse.

**Critérios de aceite:**

- o CEP é validado antes da consulta;
- peso, dimensões, quantidade e valor declarado são calculados no servidor;
- o sistema informa erros de validação ou indisponibilidade do serviço.

### RF-010 — Consultar modalidades de frete

O sistema deve consultar a API do Melhor Envio e apresentar as modalidades disponíveis, com preço e prazo estimados.

**Critérios de aceite:**

- o token da integração não é enviado ao navegador;
- o visitante pode selecionar uma modalidade retornada;
- a interface informa que preço e prazo serão confirmados no atendimento.

## 6. Solicitação pelo WhatsApp

### RF-011 — Gerar mensagem comercial

O sistema deve gerar uma mensagem estruturada com produtos, SKUs, quantidades, preços revalidados, subtotal e frete estimado selecionado.

**Critérios de aceite:**

- a mensagem utiliza dados revalidados no servidor;
- o total estimado é calculado com os valores vigentes;
- a mensagem deixa claro que a solicitação depende de confirmação comercial.

### RF-012 — Direcionar para o WhatsApp

O sistema deve abrir o WhatsApp Web ou aplicativo com o número comercial e a mensagem gerada previamente preenchidos.

**Critérios de aceite:**

- o número utilizado é obtido das configurações comerciais;
- a mensagem é codificada corretamente para a URL;
- abrir ou enviar a mensagem não reserva nem reduz o estoque.

## 7. Autenticação e administração

### RF-013 — Autenticar administrador

O sistema deve permitir que administradores autorizados iniciem e encerrem sessões por meio do Supabase Auth.

**Critérios de aceite:**

- credenciais inválidas não concedem acesso;
- rotas e operações administrativas validam a sessão no servidor;
- usuários não autorizados são direcionados ao fluxo de autenticação.

### RF-014 — Gerenciar produtos

O administrador deve poder criar, consultar, editar, duplicar, ordenar, publicar e despublicar produtos.

**Critérios de aceite:**

- nome, SKU, preço fixo, descrição, peso e dimensões são validados;
- SKU é único;
- somente produtos válidos podem ser publicados;
- exclusões ou arquivamentos respeitam os registros históricos relacionados.

### RF-015 — Gerenciar categorias

O administrador deve poder criar, editar, ordenar e controlar a disponibilidade de categorias.

**Critérios de aceite:**

- nomes e identificadores são validados;
- relações com produtos são preservadas de forma consistente;
- categorias indisponíveis não são oferecidas como filtro público.

### RF-016 — Gerenciar imagens de produtos

O administrador deve poder enviar, validar, ordenar e remover imagens, além de definir a imagem principal do produto.

**Critérios de aceite:**

- formato e tamanho do arquivo são validados;
- cada produto aceita no máximo dez imagens;
- os arquivos são armazenados no storage e o banco guarda endereços e metadados;
- a remoção mantém a definição de imagem principal consistente.

## 8. Estoque e auditoria

### RF-017 — Registrar entrada de estoque

O administrador deve poder registrar uma entrada informando produto, quantidade e motivo.

**Critérios de aceite:**

- somente quantidades inteiras e positivas são aceitas;
- o saldo é atualizado de forma transacional;
- responsável, data, quantidade e motivo ficam registrados.

### RF-018 — Registrar saída de estoque

O administrador deve poder registrar uma saída após a confirmação comercial.

**Critérios de aceite:**

- a saída não pode gerar estoque negativo;
- o saldo é atualizado de forma transacional;
- a abertura ou o envio de mensagem no WhatsApp não cria saída automaticamente.

### RF-019 — Registrar correção de estoque

O administrador deve poder corrigir o saldo mediante justificativa obrigatória.

**Critérios de aceite:**

- o saldo anterior e o novo saldo são registrados;
- a correção identifica o administrador responsável;
- o histórico de movimentações não pode ser alterado ou excluído pela interface comum.

### RF-020 — Consultar histórico de estoque

O administrador deve poder consultar o histórico de movimentações por produto, período, tipo e responsável.

**Critérios de aceite:**

- o histórico apresenta entradas, saídas e correções em ordem cronológica;
- filtros não alteram os registros armazenados;
- cada registro permite identificar sua origem e justificativa.

### RF-021 — Registrar ações administrativas críticas

O sistema deve registrar em log as alterações administrativas críticas.

**Critérios de aceite:**

- o log identifica ação, entidade, responsável e data;
- quando aplicável, valores anteriores e posteriores são preservados;
- os registros não podem ser modificados por usuários comuns.

## 9. Configurações comerciais

### RF-022 — Gerenciar configurações do site

O administrador deve poder editar o número comercial do WhatsApp, CEP de origem, taxa de manuseio e metadados públicos do catálogo.

**Critérios de aceite:**

- os dados são validados no servidor;
- alterações críticas são auditadas;
- segredos de integração não são exibidos nem editados como configurações públicas.

## 10. Rastreabilidade resumida

| Área | Requisitos |
| --- | --- |
| Catálogo público | RF-001 a RF-005 |
| Lista de interesse | RF-006 a RF-008 |
| Frete | RF-009 e RF-010 |
| WhatsApp | RF-011 e RF-012 |
| Administração | RF-013 a RF-016 |
| Estoque e auditoria | RF-017 a RF-021 |
| Configurações | RF-022 |
