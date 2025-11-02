# Deployment

O deployment acontece automaticamente ao ser feito um pull request para a branch `main`.

## Ambiente de Produção: Render

A aplicação está configurada para deploy automático na plataforma **[Render](https://projeto-integrado-vbaa.onrender.com)** com a seguinte arquitetura:

- **Web Service**: Hospedagem da API Node.js
- **PostgreSQL Database**: Banco de dados gerenciado pelo Render
