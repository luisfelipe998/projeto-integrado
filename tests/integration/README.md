# Testes de Integração

Testes de integração para a API da Biblioteca usando testcontainers com PostgreSQL.

## O que são

Os testes de integração verificam se os repositórios funcionam corretamente com um banco de dados PostgreSQL real, testando:
- Operações CRUD (criar, ler, atualizar, deletar)
- Regras de negócio no banco de dados
- Relacionamentos entre tabelas
- Views e procedures

## Arquivos

- `setup.ts` - Configuração do banco de dados de teste
- `user.integration.test.ts` - Testes do repositório de usuários
- `book.integration.test.ts` - Testes do repositório de livros
- `loan.integration.test.ts` - Testes do repositório de empréstimos

## Como executar

```bash
# Executar testes de integração
npm run test:integration
```

## Requisitos

- Docker rodando (para os testcontainers)
- PostgreSQL 15 (criado automaticamente)

## Como funciona

1. Cada teste inicia um container PostgreSQL limpo
2. Aplica o schema do banco (`db/init.sql`)
3. Executa os testes
4. Limpa os dados entre testes
5. Destrói o container ao final
