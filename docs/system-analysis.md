# Análise Técnica do Sistema - API de Gerenciamento de Biblioteca

# 1 Descritivo Funcional do Projeto

O projeto consiste em uma API REST para gerenciamento de biblioteca que permite o controle completo de usuários, livros e empréstimos. O sistema resolve o problema de gestão manual de bibliotecas, automatizando processos de cadastro, empréstimo, devolução e controle de multas.

## 1.1 Visão Geral

O sistema é direcionado para bibliotecas que necessitam de uma solução digital para gerenciar seu acervo e controlar empréstimos. O impacto esperado é a automatização completa dos processos bibliotecários, reduzindo erros manuais e melhorando a eficiência operacional através de validações automáticas e cálculo de multas.

## 1.2 Escopo do Projeto

**O que o sistema faz:**
- Gerenciamento completo de usuários (CRUD)
- Gerenciamento completo de livros (CRUD) 
- Controle de empréstimos e devoluções
- Cálculo automático de multas por atraso
- Controle de status dos livros (disponível/emprestado/atrasado)
- Validações de integridade e regras de negócio
- Relatórios de empréstimos por usuário

**Fora do escopo:**
- Interface gráfica (apenas API)
- Sistema de autenticação/autorização
- Integração com sistemas externos
- Reserva de livros
- Renovação de empréstimos

## 1.3 Requisitos Funcionais

| ID | Requisito | Status | Referência |
|----|-----------|--------|------------|
| RF01 | Cadastrar usuários com validação de email e CPF únicos | ✅ | [requirements.md - Cadastro de Usuários](requirements.md#1-gerenciamento-de-usuários) |
| RF02 | Listar e consultar usuários por ID | ✅ | [requirements.md - Consulta de Usuários](requirements.md#feature-consulta-de-usuários) |
| RF03 | Excluir usuários (apenas sem empréstimos ativos) | ✅ | [requirements.md - Exclusão de Usuários](requirements.md#feature-exclusão-de-usuários) |
| RF04 | Listar empréstimos de um usuário específico | ✅ | [requirements.md - Consulta de Empréstimos](requirements.md#feature-consulta-de-empréstimos) |
| RF05 | Cadastrar livros com validação de dados | ✅ | [requirements.md - Cadastro de Livros](requirements.md#2-gerenciamento-de-livros) |
| RF06 | Listar livros com status automático | ✅ | [requirements.md - Consulta de Livros](requirements.md#feature-consulta-de-livros) |
| RF07 | Buscar livros por título ou ISBN | ✅ | [requirements.md - Consulta de Livros](requirements.md#feature-consulta-de-livros) |
| RF08 | Atualizar e excluir livros | ✅ | [requirements.md - Atualização/Exclusão](requirements.md#feature-atualização-de-livros) |
| RF09 | Criar empréstimos com validações | ✅ | [requirements.md - Criação de Empréstimos](requirements.md#3-gerenciamento-de-empréstimos) |
| RF10 | Listar empréstimos com detalhes completos | ✅ | [requirements.md - Consulta de Empréstimos](requirements.md#feature-consulta-de-empréstimos) |
| RF11 | Devolver livros com cálculo de multa | ✅ | [requirements.md - Devolução de Livros](requirements.md#feature-devolução-de-livros) |
| RF12 | Calcular status automático dos livros | ✅ | [requirements.md - Controle de Status](requirements.md#4-regras-de-negócio) |
| RF13 | Calcular multas por atraso (R$ 1,00/dia) | ✅ | [requirements.md - Cálculo de Multas](requirements.md#feature-cálculo-de-multas) |
| RF14 | Validar integridade de dados | ✅ | [requirements.md - Validações](requirements.md#feature-validações-de-integridade) |

## 1.4 Requisitos Não Funcionais

- **Desempenho**: API deve responder em menos de 2 segundos
- **Confiabilidade**: Sistema deve estar disponível 99% do tempo
- **Usabilidade**: API RESTful seguindo padrões HTTP
- **Manutenibilidade**: Código TypeScript com arquitetura limpa

---

# 2 Estrutura e Módulos do Sistema

## 2.1 Visão dos Módulos

| Módulo | Descrição |
|--------|-----------|
| **User Module** | Gerenciamento completo de usuários da biblioteca |
| **Book Module** | Controle do catálogo de livros e status |
| **Loan Module** | Gestão de empréstimos e devoluções |
| **Database Module** | Camada de acesso a dados PostgreSQL |
| **API Module** | Controladores REST e roteamento |

## 2.2 Descrição de Cada Módulo

### Módulo 1 – User Module
- **Responsabilidade principal**: Gerenciar usuários da biblioteca
- **Componentes internos**: 
  - `User` (model)
  - `UserController` (REST endpoints)
  - `UserRepository` (interface)
  - `PostgresUserRepository` (implementação)
- **Entradas**: Dados do usuário (name, email, cpf, address)
- **Saídas**: Usuário criado/atualizado, lista de usuários, empréstimos do usuário
- **Principais fluxos**: Validação de email/CPF únicos, verificação de empréstimos ativos antes da exclusão

### Módulo 2 – Book Module
- **Responsabilidade principal**: Controlar catálogo de livros e seus status
- **Componentes internos**:
  - `Book` (model)
  - `BookController` (REST endpoints)
  - `BookRepository` (interface)
  - `PostgresBookRepository` (implementação)
- **Entradas**: Dados do livro (title, author, year, isbn)
- **Saídas**: Livro criado/atualizado, lista de livros com status
- **Principais fluxos**: Cálculo automático de status (available/rented/late), validação de ano e ISBN

### Módulo 3 – Loan Module
- **Responsabilidade principal**: Gerenciar empréstimos e devoluções
- **Componentes internos**:
  - `Loan` (model)
  - `LoanController` (REST endpoints)
  - `LoanRepository` (interface)
  - `PostgresLoanRepository` (implementação)
- **Entradas**: Dados do empréstimo (userId, bookId, startDate, endDate)
- **Saídas**: Empréstimo criado, lista de empréstimos com multas calculadas
- **Principais fluxos**: Validação de disponibilidade do livro, verificação de atrasos do usuário, cálculo de multas

### Módulo 4 – Database Module
- **Responsabilidade principal**: Acesso e persistência de dados
- **Componentes internos**:
  - `client.ts` (configuração PostgreSQL)
  - Views (`books_status`, `loan_detailed_view`)
  - Triggers (validações de integridade)
  - Procedures (devolução de livros)
- **Entradas**: Queries SQL e parâmetros
- **Saídas**: Resultados das consultas
- **Principais fluxos**: Conexão com retry, execução de queries com prepared statements

### Módulo 5 – API Module
- **Responsabilidade principal**: Exposição dos endpoints REST
- **Componentes internos**:
  - `index.ts` (configuração Express)
  - Roteamento HTTP
  - Middleware de erro
  - Health check
- **Entradas**: Requisições HTTP
- **Saídas**: Respostas JSON com status codes apropriados
- **Principais fluxos**: Roteamento, injeção de dependências, tratamento de erros

---

# 3 Arquitetura Geral

## 3.1 Diagrama de Blocos

```mermaid
graph TB
    Client[Cliente HTTP] --> API[API Layer - Express.js]
    API --> UC[User Controller]
    API --> BC[Book Controller] 
    API --> LC[Loan Controller]
    
    UC --> UR[User Repository Interface]
    BC --> BR[Book Repository Interface]
    LC --> LR[Loan Repository Interface]
    
    UR --> PUR[Postgres User Repository]
    BR --> PBR[Postgres Book Repository]
    LR --> PLR[Postgres Loan Repository]
    
    PUR --> DB[(PostgreSQL Database)]
    PBR --> DB
    PLR --> DB
    
    DB --> Views[Views: books_status, loan_detailed_view]
    DB --> Triggers[Triggers: Validações]
    DB --> Procedures[Procedures: return_book]
```

## 3.2 Fluxo de Dados

1. **Requisição HTTP** chega ao Express.js
2. **Roteamento** direciona para o controller apropriado
3. **Controller** processa a requisição e chama o repository
4. **Repository** executa queries no PostgreSQL
5. **Database** aplica triggers/constraints e retorna dados
6. **Views** calculam campos derivados (status, multas)
7. **Repository** mapeia dados do banco para models
8. **Controller** retorna resposta JSON com status HTTP apropriado

---

# 4 Integrações e Dependências

| Dependência | Versão | Função | Protocolo |
|-------------|--------|--------|-----------|
| **Express.js** | 5.1.0 | Framework web para API REST | HTTP |
| **PostgreSQL** | 15 | Banco de dados relacional | TCP/IP |
| **postgres** | 3.4.7 | Driver PostgreSQL para Node.js | TCP/IP |
| **TypeScript** | 5.6.2 | Tipagem estática | - |
| **Docker** | - | Containerização | - |
| **Bruno** | - | Testes de API | HTTP |

**Integrações Externas**: Nenhuma integração externa implementada.

---

# 5 Segurança

**Status Atual**: Sistema sem autenticação/autorização implementada.

**Medidas de Segurança Implementadas**:
- Proteção contra SQL Injection via prepared statements
- Validação de dados no banco (constraints)
- Sanitização básica de inputs

**Recomendações**:
- Implementar autenticação JWT
- Adicionar rate limiting
- Implementar HTTPS
- Validação mais robusta de inputs

---

# 6 Testes

**Testes Implementados**:
- Coleção de testes manuais (Bruno API Client)
- Cenários de sucesso e erro para todos os endpoints

**Tipos de Teste Cobertos**:
- Testes de integração via API
- Validação de regras de negócio
- Testes de casos de erro

**Ferramentas**:
- Bruno (testes de API)

**Recomendações**:
- Implementar testes unitários (Jest)
- Testes de integração automatizados
- Testes de carga

---

# 7 Estrutura de Diretórios

```
Project/
├── src/
│   ├── application/              # Camada de aplicação
│   │   ├── user/                # Módulo de usuários
│   │   │   ├── user.ts          # Model
│   │   │   ├── userController.ts # Controller
│   │   │   └── userRepository.ts # Interface
│   │   ├── book/                # Módulo de livros
│   │   │   ├── book.ts
│   │   │   ├── bookController.ts
│   │   │   └── bookRepository.ts
│   │   └── loan/                # Módulo de empréstimos
│   │       ├── loan.ts
│   │       ├── loanController.ts
│   │       └── loanRepository.ts
│   ├── infra/                   # Camada de infraestrutura
│   │   └── postgres/            # Implementações PostgreSQL
│   │       ├── client.ts        # Cliente de conexão
│   │       ├── userRepository.ts
│   │       ├── bookRepository.ts
│   │       └── loanRepository.ts
│   └── index.ts                 # Ponto de entrada
├── db/                          # Scripts de banco
│   ├── init.sql                 # Schema e triggers
│   └── pre_data.sql             # Dados iniciais
├── collection/                  # Testes da API
│   └── Library API/             # Coleção Bruno
├── docs/                        # Documentação
│   ├── requirements.md          # Requisitos
│   └── system-analysis.md       # Esta análise
├── docker-compose.yml           # Orquestração
├── dockerfile                   # Imagem da aplicação
├── package.json                 # Dependências Node.js
└── tsconfig.json               # Configuração TypeScript
```

# 8 Melhores Práticas

## Design Patterns Implementados

- **Repository Pattern**: Abstração da camada de dados
- **Dependency Injection**: Controllers recebem repositories via construtor
- **Clean Architecture**: Separação clara entre camadas (application/infra)
- **Factory Pattern**: Criação de instâncias dos repositories

## Práticas de Desenvolvimento

- **TypeScript**: Tipagem estática para maior segurança
- **Interfaces**: Contratos bem definidos entre camadas
- **Prepared Statements**: Proteção contra SQL injection
- **Error Handling**: Tratamento centralizado de erros
- **Environment Variables**: Configuração flexível
- **Docker**: Containerização para consistência de ambiente

## Práticas de Banco de Dados

- **Constraints**: Validação de integridade no banco
- **Triggers**: Regras de negócio críticas no banco
- **Views**: Cálculos complexos otimizados
- **Procedures**: Operações atômicas complexas
- **Foreign Keys**: Integridade referencial

## Recomendações para Manutenção

1. **Testes Automatizados**: Implementar cobertura de testes
2. **Logging Estruturado**: Adicionar logs detalhados
3. **Monitoramento**: Métricas de performance e saúde
4. **Documentação**: Manter documentação atualizada
5. **Code Review**: Processo de revisão de código
6. **Versionamento**: Semantic versioning para releases
7. **Migrations**: Sistema de versionamento do banco
8. **CI/CD**: Pipeline automatizado de deploy

## Padrões de Código

- **Naming Convention**: camelCase para variáveis, PascalCase para classes
- **File Organization**: Um arquivo por classe/interface
- **Error Messages**: Mensagens descritivas e códigos específicos
- **HTTP Status Codes**: Uso correto dos códigos de resposta
- **RESTful Design**: Endpoints seguindo padrões REST
