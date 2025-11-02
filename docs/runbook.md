# Runbook

Aqui está documentado os comandos preconfigurados da aplicação, bem como as dependências necessárias para rodar, desenvolver e testar a aplicação.

## Comandos Disponíveis

O projeto possui os seguintes scripts npm configurados no `package.json`:

### Desenvolvimento
- `npm run build` - Compila o código TypeScript para JavaScript (limpa a pasta dist antes)
- `npm run clear` - Remove a pasta dist
- `npm run start:local` - Compila e executa a aplicação localmente
- `npm run start:local:container` - Inicia a aplicação usando Docker Compose
- `npm run stop:local:container` - Para os containers Docker

### Testes
- `npm run test:unit` - Executa testes unitários com cobertura
- `npm run test:integration` - Executa testes de integração com cobertura
- `npm run test:e2e` - Executa testes end-to-end completos

### Qualidade de Código
- `npm run lint` - Executa análise estática do código com ESLint
- `npm run lint:fix` - Executa ESLint e corrige automaticamente problemas encontrados

## Pré-requisitos

Para executar este projeto, você precisa ter instalado:

### Requisitos Obrigatórios
- **Node.js** (versão 18 ou superior)
- **npm** (geralmente incluído com Node.js)
- **Docker** e **Docker Compose** (para execução com containers)

### Variáveis de Ambiente
Configure as seguintes variáveis de ambiente (use o arquivo `.example.env` como referência):
- Configurações de banco de dados PostgreSQL
- Porta da aplicação (padrão: 3000)
- Credenciais de autenticação básica

### Dependências do Projeto
As dependências são instaladas automaticamente com:
```bash
npm install
```
