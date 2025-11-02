# Testes End-to-End

Este diretório contém testes end-to-end para a API do Sistema de Gerenciamento de Biblioteca usando a ferramenta de testes Bruno API.

## Visão Geral

Os testes e2e validam a funcionalidade completa dos endpoints da API testando requisições e respostas HTTP reais. Estes testes garantem que todos os componentes funcionem corretamente em conjunto em um ambiente similar ao de produção.

## Estrutura dos Testes

Os testes são organizados em coleções usando Bruno (arquivos .bru) e cobrem os seguintes endpoints da API:

- **Books (Livros)**: Operações CRUD para gerenciamento de livros (criar, ler, atualizar, deletar)
- **Users (Usuários)**: Operações de gerenciamento de usuários e consultas específicas de usuários
- **Loans (Empréstimos)**: Criação de empréstimos, recuperação e operações de devolução

## Ambientes

- `local.bru`: Configuração para ambiente de desenvolvimento local
- `prod.bru`: Configuração para ambiente de produção

## Executando os Testes

Para executar os testes e2e, certifique-se de que o servidor da API esteja rodando e use o Bruno CLI ou a aplicação desktop do Bruno para executar a coleção de testes.

Você pode executar `npm test:local:e2e` para automaticamente rodar os testes e gerar o relatório.
