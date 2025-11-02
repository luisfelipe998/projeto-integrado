# Deployment

O deployment acontece automaticamente ao ser feito um pull request para a branch `main`.

## Ambiente de Produção: Render

A aplicação está configurada para deploy automático na plataforma **[Render](https://projeto-integrado-vbaa.onrender.com)** com a seguinte arquitetura:

- **Web Service**: Hospedagem da API Node.js
- **PostgreSQL Database**: Banco de dados gerenciado pelo Render

## Testes

Os testes são executados automaticamente ao criar um Pull request e/ou entrar um commit na main. Os artefatos são salvos na própria action que executou os testes e estão disponíveis lá para fazer download para auditoria.

[Build de exemplo.](https://github.com/luisfelipe998/projeto-integrado/actions/runs/19014177378/job/54299577931?pr=44)
