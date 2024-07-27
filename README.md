
# Payment Backend

Solução desenvolvida para o problema de transação de saldo entre contas. Desenvolvido em NestJS e manipulado por Docker e Docker Composer



## Features

- Cadastro de Conta
- Realizar transferencia


## Optimizations

- Fastify: Apresenta um ganho de performance da API em relação ao uso padrão do Express

- Promise All: Uso de processamento paralelo de Promise em consultas

- Jobs: Processamento da transação sendo feita em background com a biblioteca Bull e Redis 

- Replicas e Nginx: Utilizando mais de um container na API e um container NGINX para fazer o balanceamento de carga atuand o como proxy reverso

- Tune e Index: Utilizado index em campos do banco de dados e arquivo de configuração do banco de dados otimizado


## Tech Stack

**API:** NestJS - Fastify

**Redis:** Cahche e filas

**PostgreSQL:** Banco de dados

**NGINX:** balanceamento de carga, proxy reverso




