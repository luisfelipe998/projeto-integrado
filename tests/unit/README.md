# Testes Unitários

Este diretório contém os testes unitários para a API da Biblioteca. Os testes são executados usando Jest e TypeScript.

## Como Executar os Testes

### Executar todos os testes com cobertura
```bash
npm run test:unit
```

### Executar testes sem cobertura
```bash
npx jest
```

### Executar testes em modo watch (desenvolvimento)
```bash
npx jest --watch
```

### Executar um arquivo de teste específico
```bash
npx jest bookController.test.ts
```

## Configuração dos Testes

Os testes utilizam:
- **Jest** como framework de testes
- **ts-jest** para suporte ao TypeScript
- **Mocks** para isolar as unidades testadas
- **Coverage** para relatórios de cobertura de código

### Configuração (jest.config.js)
- Ambiente: Node.js
- Preset: ts-jest
- Diretórios de teste: `src/` e `tests/`
- Cobertura salva em: `artifacts/unit/`

## Relatórios de Cobertura

Após executar `npm run test:unit`, os relatórios de cobertura são gerados em:
- **HTML**: `artifacts/unit/lcov-report/index.html`
- **JSON**: `artifacts/unit/coverage-final.json`
- **LCOV**: `artifacts/unit/lcov.info`

## Estrutura dos Testes

Cada arquivo de teste segue o padrão:
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup antes de cada teste
  });

  describe('methodName', () => {
    it('should do something when condition', async () => {
      // Arrange, Act, Assert
    });
  });
});
```

## Mocks

Os testes utilizam mocks do Jest para:
- Isolar unidades de código
- Simular dependências externas
- Controlar comportamentos específicos
- Verificar chamadas de métodos

