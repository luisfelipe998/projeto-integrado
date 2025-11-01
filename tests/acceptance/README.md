# Guia de Testes de Aceitação - Sistema de Biblioteca

## Descrição

Este documento apresenta os testes de aceitação para o Sistema de Gerenciamento de Biblioteca, organizados por funcionalidade. Os testes cobrem as principais operações do sistema: gerenciamento de usuários, livros e empréstimos, além das regras de negócio específicas da biblioteca.

O sistema implementa uma API REST para gerenciar uma biblioteca, incluindo:

- **Gerenciamento de Usuários**: Cadastro, consulta e exclusão de usuários com validações de email e CPF
- **Gerenciamento de Livros**: CRUD completo de livros com controle de status (disponível, emprestado, em atraso)
- **Gerenciamento de Empréstimos**: Criação de empréstimos, controle de devoluções e cálculo automático de multas
- **Regras de Negócio**: Validações de integridade, controle de status automático e cálculo de multas por atraso

## Tabela de Controle de Testes de Aceitação

| ID | Funcionalidade | Cenário de Teste | Status | Data Execução | Executado Por | Observações | Aceito (S/N) |
|----|----------------|------------------|--------|---------------|---------------|-------------|--------------|
| **USUÁRIOS** |
| U01 | Cadastro de Usuários | Cadastrar usuário com dados válidos | ✅ | 01/11/2025 | Luis Felipe |  | S |
| U02 | Cadastro de Usuários | Tentar cadastrar usuário com email duplicado | ✅ | 01/11/2025 | Luis Felipe |  | S |
| U03 | Cadastro de Usuários | Tentar cadastrar usuário com CPF inválido | ✅ | 01/11/2025 | Luis Felipe |  | S |
| U04 | Consulta de Usuários | Listar todos os usuários | ✅ | 01/11/2025 | Luis Felipe |  | S |
| U05 | Consulta de Usuários | Buscar usuário por ID existente | ✅ | 01/11/2025 | Luis Felipe |  | S |
| U06 | Consulta de Usuários | Buscar usuário por ID inexistente | ✅ | 01/11/2025 | Luis Felipe |  | S |
| U07 | Exclusão de Usuários | Excluir usuário sem empréstimos ativos | ✅ | 01/11/2025 | Luis Felipe |  | S |
| U08 | Exclusão de Usuários | Tentar excluir usuário com empréstimos ativos | ✅ | 01/11/2025 | Luis Felipe |  | S |
| **LIVROS** |
| L01 | Cadastro de Livros | Cadastrar livro com dados válidos | ✅ | 01/11/2025 | Luis Felipe |  | S |
| L02 | Cadastro de Livros | Tentar cadastrar livro com ano inválido | ✅ | 01/11/2025 | Luis Felipe |  | S |
| L03 | Cadastro de Livros | Tentar cadastrar livro com título vazio | ✅ | 01/11/2025 | Luis Felipe |  | S |
| L04 | Consulta de Livros | Listar todos os livros com status | ✅ | 01/11/2025 | Luis Felipe |  | S |
| L05 | Consulta de Livros | Buscar livro por ID | ✅ | 01/11/2025 | Luis Felipe |  | S |
| L06 | Atualização de Livros | Atualizar dados de um livro | ✅ | 01/11/2025 | Luis Felipe |  | S |
| L07 | Atualização de Livros | Tentar atualizar livro inexistente | ✅ | 01/11/2025 | Luis Felipe |  | S |
| L08 | Exclusão de Livros | Excluir livro sem empréstimos ativos | ✅ | 01/11/2025 | Luis Felipe |  | S |
| L09 | Exclusão de Livros | Tentar excluir livro com empréstimos ativos | ✅ | 01/11/2025 | Luis Felipe |  | S |
| **EMPRÉSTIMOS** |
| E01 | Criação de Empréstimos | Criar empréstimo com dados válidos | ✅ | 01/11/2025 | Luis Felipe |  | S |
| E02 | Criação de Empréstimos | Tentar criar empréstimo para livro já emprestado | ✅ | 01/11/2025 | Luis Felipe |  | S |
| E03 | Criação de Empréstimos | Tentar criar empréstimo para usuário com empréstimos em atraso | ✅ | 01/11/2025 | Luis Felipe |  | S |
| E04 | Criação de Empréstimos | Tentar criar empréstimo com data de fim anterior à data de início | ✅ | 01/11/2025 | Luis Felipe |  | S |
| E05 | Consulta de Empréstimos | Listar todos os empréstimos | ✅ | 01/11/2025 | Luis Felipe |  | S |
| E06 | Consulta de Empréstimos | Buscar empréstimo por ID | ✅ | 01/11/2025 | Luis Felipe |  | S |
| E07 | Consulta de Empréstimos | Listar empréstimos de um usuário específico | ✅ | 01/11/2025 | Luis Felipe |  | S |
| E08 | Devolução de Livros | Devolver livro dentro do prazo | ✅ | 01/11/2025 | Luis Felipe |  | S |
| E09 | Devolução de Livros | Devolver livro em atraso | ✅ | 01/11/2025 | Luis Felipe |  | S |
| E10 | Devolução de Livros | Tentar devolver empréstimo já devolvido | ✅ | 01/11/2025 | Luis Felipe |  | S |
| E11 | Devolução de Livros | Tentar devolver empréstimo inexistente | ✅ | 01/11/2025 | Luis Felipe |  | S |
| **REGRAS DE NEGÓCIO** |
| R01 | Controle de Status | Verificar status automático dos livros | ✅ | 01/11/2025 | Luis Felipe |  | S |
| R02 | Cálculo de Multas | Calcular multa para empréstimo em atraso | ✅ | 01/11/2025 | Luis Felipe |  | S |
| R03 | Validações | Validar formato de email | ✅ | 01/11/2025 | Luis Felipe |  | S |
| R04 | Validações | Validar formato de CPF | ✅ | 01/11/2025 | Luis Felipe |  | S |
| R05 | Validações | Validar formato de ISBN | ✅ | 01/11/2025 | Luis Felipe |  | S |
| R06 | Validações | Validar ano de publicação | ✅ | 01/11/2025 | Luis Felipe |  | S |

## Legenda de Status

- ⏳ **Pendente**: Teste ainda não executado
- ✅ **Passou**: 
- ❌ **Falhou**: Teste executado com falha
- 🔄 **Reexecutar**: Teste precisa ser executado novamente

## Instruções para Preenchimento

1. **Status**: Atualize com o emoji correspondente após a execução
2. **Data Execução**: Preencha com a data no formato DD/MM/AAAA
3. **Executado Por**: Nome da pessoa que executou o teste
4. **Observações**: Anote qualquer comportamento inesperado, bugs encontrados ou comentários relevantes
5. **Aceito (S/N)**: Marque "S" se o comportamento está conforme esperado, "N" se há problemas que impedem a aceitação

## Critérios de Aceitação

Para que uma funcionalidade seja considerada aceita, todos os cenários de teste relacionados devem:

1. Executar sem erros técnicos
2. Retornar os códigos de status HTTP corretos
4. Manter a integridade dos dados no banco
5. Seguir as regras de negócio definidas

## Ambiente de Teste

- **Banco de Dados**: PostgreSQL (ambiente de teste)
- **Ferramenta Recomendada**: Bruno
- **Dados de Teste**: Utilizar dados fictícios que não comprometam informações reais
