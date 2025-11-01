# Requisitos do Sistema - API de Gerenciamento de Biblioteca

## Visão Geral
Sistema de API REST para gerenciamento de uma biblioteca, permitindo o cadastro e controle de livros, usuários e empréstimos.

## Funcionalidades Principais

Veja [aqui](../tests/acceptance/)

## Endpoints da API

### Usuários
- `GET /users` - Listar todos os usuários
- `GET /users/:id` - Buscar usuário por ID
- `GET /users/:id/loans` - Listar empréstimos de um usuário
- `POST /users` - Criar novo usuário
- `DELETE /users/:id` - Excluir usuário

### Livros
- `GET /books` - Listar todos os livros com status
- `GET /books/:id` - Buscar livro por ID
- `POST /books` - Criar novo livro
- `PUT /books/:id` - Atualizar livro
- `DELETE /books/:id` - Excluir livro

### Empréstimos
- `GET /loans` - Listar todos os empréstimos
- `GET /loans/:id` - Buscar empréstimo por ID
- `POST /loans` - Criar novo empréstimo
- `PUT /loans/:id/return` - Devolver livro

### Sistema
- `GET /health` - Verificar saúde da aplicação

## Modelos de Dados

### Usuário
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "cpf": "123.456.789-00",
  "address": "Rua das Flores, 100, Centro"
}
```

### Livro
```json
{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "year": 2008,
  "isbn": "978-0132350884",
  "status": "available"
}
```

### Empréstimo
```json
{
  "id": 1,
  "userId": 1,
  "book": {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "year": 2008,
    "isbn": "978-0132350884"
  },
  "startDate": "2025-01-01",
  "endDate": "2025-01-15",
  "returnDate": null,
  "status": "active",
  "lateDays": 0,
  "fine": 0
}
```

## Códigos de Erro Personalizados

- `B0001` - Não é possível excluir livro com empréstimos ativos
- `U0001` - Não é possível excluir usuário com empréstimos ativos  
- `L0001` - Não é possível criar empréstimo: Livro não está disponível
- `L0002` - Não é possível criar empréstimo: Usuário possui empréstimos em atraso
- `L0003` - Empréstimo não encontrado ou já devolvido
