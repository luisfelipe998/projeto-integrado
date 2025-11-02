# projeto-integrado

Projeto realizado para a disciplina de projeto integrado, com o objetivo de  desenvolver todas as etapas do desenvolvimento de um projeto de software (levantamento de requisitos,  documentação, organização do código/esquemáticos, documentação do ciclo de desenvolvimento com cronograma ou histórico do backlog, implementação e testes).

## Descrição do Projeto

Este projeto consiste em uma API REST para gerenciamento de biblioteca desenvolvida em Node.js com TypeScript. O sistema permite o controle de usuários, livros e empréstimos, implementando funcionalidades completas de CRUD (Create, Read, Update, Delete) para cada entidade. A aplicação foi desenvolvida seguindo princípios de arquitetura limpa, com separação clara entre camadas de aplicação, infraestrutura e middleware, incluindo autenticação básica para proteção dos endpoints.

## Documentação

A pasta `docs/` contém toda a documentação técnica do projeto.

Para documentação geral completa do projeto, acesse: [Documentação do projeto](https://github.com/luisfelipe998/projeto-integrado/wiki)

## Disponibilidade da Aplicação

A aplicação pode ser chamada através do seguinte host:

```
https://projeto-integrado-vbaa.onrender.com
```

Consulte [aqui](./docs/requirements.md#endpoints-da-api) os endpoints disponíveis.
Pode ser utilizada a collection no [Bruno](https://www.usebruno.com/) em `tests/e2e/collection/library_api` como base para realizar testes na API. É necessário uma autenticação Basic para chamar a aplicação, entrar em contato com o aluno para receber as credenciais.