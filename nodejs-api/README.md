# Cursos pra Todos NodeJS API

🚀 API principal do app Cursos pra todos.

## Ferramentas

[Adonis 5](https://preview.adonisjs.com/)

[Classic Yarn](https://classic.yarnpkg.com/lang/en/)

[NodeJS 12](https://nodejs.org/en/)

[PostgreSQL com Docker](https://docs.docker.com/compose/)

[Recomendado Insomnia para REST](https://insomnia.rest/)

## Instalação

Você precisará ter ao menos o NodeJS instalado na versão indicada acima, o classic yarn (V1) para controle de pacotes, e idealmente Docker instalado em sua máquina para subir o banco de dados (você também pode ter o banco de dados local, e só alterar a configuração em .env)

```bash
# Copie e edite suas variáveis de ambiente
cp .env.example .env && vi .env # pode usar seu editor preferido

# Instale as dependências com yarn (por conta do yarn.lock)
yarn

# Inicia o banco de dados com Docker para executar migrações e seed
docker-compose up

# Rode os scripts de migração para criar o banco de dados local
# Lembre de ter o banco de dados criado e configurado (.env)
yarn migrate:run

# Se você já tiver executado isso anteriormente, você pode realizar um rollback, ou só executar o migrate:full para realizar o rollback e o run em seguida
yarn migrate:rollback
# OU
yarn migrate:full

# E finalmente você pode rodar o seeder para cadastrar todos os dados necessários (como Roles), e também registrar alguns usuários de exemplo
yarn seed

# Usuários de exemplo:
# EMAIL               : SENHA
# test@test.com       : 123456
# test2@test.com      : 1234567
# test3@test.com      : 12345678
# test4@test.com      : 123456789
# test5@test.com      : 1234567890
# Exemplo de instrutor
# instructor@test.com : 123456
```

## Rodando em desenvolvimento

```bash
# Inicia o banco de dados com Docker
docker-compose up

# Inicia o servidor e escuta alterações nos arquivos locais (faz rebuild automaticamente)
yarn start

# Você pode sempre verificar todos comandos disponíveis executando
node ace
```

Se você possuir o aplicativo Insomnia, poderá usar o arquivo [Insomnia.json](Insomnia.json) que inclui vários exemplos das requisições HTTP

## Executando testes

Siga os passos do `Rodando em desenvolvimento` em um terminal aberto

Abra outro terminal e nele execute o comando:

```bash
yarn test
```
