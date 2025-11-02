### 1. Gerenciamento de Usuários

**Feature: Cadastro de Usuários**
```gherkin
Scenario: U01 - Cadastrar um novo usuário com dados válidos
  Given que eu sou um administrador da biblioteca
  When eu envio uma requisição POST para "/users" com os dados:
    | name    | João Silva                    |
    | email   | joao.silva@example.com        |
    | cpf     | 123.456.789-00               |
    | address | Rua das Flores, 100, Centro   |
  Then o sistema deve retornar status 201
  And o usuário deve ser criado com um ID único
  And os dados do usuário devem ser armazenados no banco de dados

Scenario: U02 - Tentar cadastrar usuário com email duplicado
  Given que já existe um usuário com email "joao.silva@example.com"
  When eu envio uma requisição POST para "/users" com email "joao.silva@example.com"
  Then o sistema deve retornar status 400
  And deve exibir mensagem de erro informando que o email já está em uso

Scenario: U03 - Tentar cadastrar usuário com CPF inválido
  Given que eu sou um administrador da biblioteca
  When eu envio uma requisição POST para "/users" com CPF "123.456.789-99"
  Then o sistema deve retornar status 400
  And deve exibir mensagem de erro sobre formato de CPF inválido
```

**Feature: Consulta de Usuários**
```gherkin
Scenario: U04 - Listar todos os usuários
  Given que existem usuários cadastrados no sistema
  When eu envio uma requisição GET para "/users"
  Then o sistema deve retornar status 200
  And deve retornar uma lista com todos os usuários cadastrados

Scenario: U05 - Buscar usuário por ID existente
  Given que existe um usuário com ID 1
  When eu envio uma requisição GET para "/users/1"
  Then o sistema deve retornar status 200
  And deve retornar os dados completos do usuário

Scenario: U06 - Buscar usuário por ID inexistente
  Given que não existe usuário com ID 999
  When eu envio uma requisição GET para "/users/999"
  Then o sistema deve retornar status 404
  And deve exibir mensagem informando que o usuário não foi encontrado
```

**Feature: Exclusão de Usuários**
```gherkin
Scenario: U07 - Excluir usuário sem empréstimos ativos
  Given que existe um usuário com ID 1
  And o usuário não possui empréstimos ativos
  When eu envio uma requisição DELETE para "/users/1"
  Then o sistema deve retornar status 200
  And o usuário deve ser removido do banco de dados

Scenario: U08 - Tentar excluir usuário com empréstimos ativos
  Given que existe um usuário com ID 1
  And o usuário possui empréstimos ativos
  When eu envio uma requisição DELETE para "/users/1"
  Then o sistema deve retornar status 400
  And deve exibir mensagem informando que não é possível excluir usuário com empréstimos ativos
```

### 2. Gerenciamento de Livros

**Feature: Cadastro de Livros**
```gherkin
Scenario: L01 - Cadastrar um novo livro com dados válidos
  Given que eu sou um administrador da biblioteca
  When eu envio uma requisição POST para "/books" com os dados:
    | title  | Clean Code                |
    | author | Robert C. Martin          |
    | year   | 2008                      |
    | isbn   | 978-0132350884           |
  Then o sistema deve retornar status 201
  And o livro deve ser criado com um ID único
  And o status inicial do livro deve ser "available"

Scenario: L02 - Tentar cadastrar livro com ano inválido
  Given que eu sou um administrador da biblioteca
  When eu envio uma requisição POST para "/books" com year menor que 1000
  Then o sistema deve retornar status 400
  And deve exibir mensagem de erro sobre ano inválido

Scenario: L03 - Tentar cadastrar livro com título vazio
  Given que eu sou um administrador da biblioteca
  When eu envio uma requisição POST para "/books" com title vazio
  Then o sistema deve retornar status 400
  And deve exibir mensagem de erro sobre título obrigatório
```

**Feature: Consulta de Livros**
```gherkin
Scenario: L04 - Listar todos os livros com status
  Given que existem livros cadastrados no sistema
  When eu envio uma requisição GET para "/books"
  Then o sistema deve retornar status 200
  And deve retornar uma lista com todos os livros
  And cada livro deve incluir seu status atual (available, rented, late)

Scenario: L05 - Buscar livro por ID
  Given que existe um livro com ID 1
  When eu envio uma requisição GET para "/books/1"
  Then o sistema deve retornar status 200
  And deve retornar os dados completos do livro incluindo status
```

**Feature: Atualização de Livros**
```gherkin
Scenario: L06 - Atualizar dados de um livro
  Given que existe um livro com ID 1
  When eu envio uma requisição PUT para "/books/1" com novos dados
  Then o sistema deve retornar status 200
  And os dados do livro devem ser atualizados no banco de dados

Scenario: L07 - Tentar atualizar livro inexistente
  Given que não existe livro com ID 999
  When eu envio uma requisição PUT para "/books/999"
  Then o sistema deve retornar status 404
```

**Feature: Exclusão de Livros**
```gherkin
Scenario: L08 - Excluir livro sem empréstimos ativos
  Given que existe um livro com ID 1
  And o livro não possui empréstimos ativos
  When eu envio uma requisição DELETE para "/books/1"
  Then o sistema deve retornar status 200
  And o livro deve ser removido do banco de dados

Scenario: L09 - Tentar excluir livro com empréstimos ativos
  Given que existe um livro com ID 1
  And o livro possui empréstimos ativos
  When eu envio uma requisição DELETE para "/books/1"
  Then o sistema deve retornar status 400
  And deve exibir mensagem informando que não é possível excluir livro com empréstimos ativos
```

### 3. Gerenciamento de Empréstimos

**Feature: Criação de Empréstimos**
```gherkin
Scenario: E01 - Criar empréstimo com dados válidos
  Given que existe um usuário com ID 1
  And existe um livro disponível com ID 1
  And o usuário não possui empréstimos em atraso
  When eu envio uma requisição POST para "/loans" com os dados:
    | userId    | 1          |
    | bookId    | 1          |
    | startDate | 2025-01-01 |
    | endDate   | 2025-01-15 |
  Then o sistema deve retornar status 201
  And o empréstimo deve ser criado com status "active"
  And o status do livro deve mudar para "rented"

Scenario: E02 - Tentar criar empréstimo para livro já emprestado
  Given que existe um livro com ID 1 já emprestado
  When eu envio uma requisição POST para "/loans" com bookId 1
  Then o sistema deve retornar status 400
  And deve exibir mensagem informando que o livro não está disponível

Scenario: E03 - Tentar criar empréstimo para usuário com empréstimos em atraso
  Given que existe um usuário com ID 1
  And o usuário possui empréstimos em atraso
  When eu envio uma requisição POST para "/loans" com userId 1
  Then o sistema deve retornar status 400
  And deve exibir mensagem informando que o usuário possui empréstimos em atraso

Scenario: E04 - Tentar criar empréstimo com data de fim anterior à data de início
  Given que existe um usuário com ID 1
  And existe um livro disponível com ID 1
  When eu envio uma requisição POST para "/loans" com endDate anterior ao startDate
  Then o sistema deve retornar status 400
  And deve exibir mensagem de erro sobre datas inválidas
```

**Feature: Consulta de Empréstimos**
```gherkin
Scenario: E05 - Listar todos os empréstimos
  Given que existem empréstimos no sistema
  When eu envio uma requisição GET para "/loans"
  Then o sistema deve retornar status 200
  And deve retornar uma lista com todos os empréstimos
  And cada empréstimo deve incluir dados do livro, status, dias de atraso e multa

Scenario: E06 - Buscar empréstimo por ID
  Given que existe um empréstimo com ID 1
  When eu envio uma requisição GET para "/loans/1"
  Then o sistema deve retornar status 200
  And deve retornar os dados completos do empréstimo

Scenario: E07 - Listar empréstimos de um usuário específico
  Given que existe um usuário com ID 1
  And o usuário possui empréstimos
  When eu envio uma requisição GET para "/users/1/loans"
  Then o sistema deve retornar status 200
  And deve retornar apenas os empréstimos do usuário especificado
```

**Feature: Devolução de Livros**
```gherkin
Scenario: E08 - Devolver livro dentro do prazo
  Given que existe um empréstimo ativo com ID 1
  And a data atual está dentro do prazo de devolução
  When eu envio uma requisição PUT para "/loans/1/return"
  Then o sistema deve retornar status 200
  And o empréstimo deve ter return_date preenchida com a data atual
  And o status do empréstimo deve mudar para "returned"
  And o status do livro deve mudar para "available"
  And a multa deve ser 0

Scenario: E09 - Devolver livro em atraso
  Given que existe um empréstimo ativo com ID 1
  And a data atual está após o prazo de devolução
  When eu envio uma requisição PUT para "/loans/1/return"
  Then o sistema deve retornar status 200
  And o empréstimo deve ter return_date preenchida com a data atual
  And o status do empréstimo deve mudar para "returned"
  And deve ser calculada multa baseada nos dias de atraso
  And o status do livro deve mudar para "available"

Scenario: E10 - Tentar devolver empréstimo já devolvido
  Given que existe um empréstimo com ID 1 já devolvido
  When eu envio uma requisição PUT para "/loans/1/return"
  Then o sistema deve retornar status 400
  And deve exibir mensagem informando que o empréstimo já foi devolvido

Scenario: E11 - Tentar devolver empréstimo inexistente
  Given que não existe empréstimo com ID 999
  When eu envio uma requisição PUT para "/loans/999/return"
  Then o sistema deve retornar status 404
```

### 4. Regras de Negócio

**Feature: Controle de Status dos Livros**
```gherkin
Scenario: R01 - Verificar status automático dos livros
  Given que existem livros no sistema
  When eu consulto a lista de livros
  Then cada livro deve ter status calculado automaticamente:
    | Condição                                    | Status    |
    | Sem empréstimos ativos                      | available |
    | Com empréstimo ativo dentro do prazo        | rented    |
    | Com empréstimo ativo em atraso              | late      |
```

**Feature: Cálculo de Multas**
```gherkin
Scenario: R02 - Calcular multa para empréstimo em atraso
  Given que existe um empréstimo em atraso há 5 dias
  When eu consulto os dados do empréstimo
  Then a multa deve ser calculada como: dias_atraso * R$ 1,00
  And deve exibir lateDays = 5
  And deve exibir fine = 5.00
```

**Feature: Validações de Integridade**
```gherkin
Scenario: R03 - Validar formato de email
  When eu cadastro um usuário com email inválido
  Then o sistema deve rejeitar e exibir erro de formato

Scenario: R04 - Validar formato de CPF
  When eu cadastro um usuário com CPF que não segue o padrão XXX.XXX.XXX-XX ou XXXXXXXXXXX
  Then o sistema deve rejeitar e exibir erro de formato

Scenario: R05 - Validar formato de ISBN
  When eu cadastro um livro com ISBN que não segue o padrão numérico com hífens
  Then o sistema deve rejeitar e exibir erro de formato

Scenario: R06 - Validar ano de publicação
  When eu cadastro um livro com ano menor que 1000 ou maior que o ano atual
  Then o sistema deve rejeitar e exibir erro de ano inválido
```
