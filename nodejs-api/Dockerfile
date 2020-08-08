FROM node:12

WORKDIR /opt/app

# Installing dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

ENV PORT=3333
ENV HOST=0.0.0.0
ENV NODE_ENV=development
ENV APP_KEY=hg3HTm0WC5FbH6ePmQjrxGRuuPa4-3QK
ENV DB_CONNECTION=pg
ENV DB_HOST=127.0.0.1
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_NAME=cursos_pra_todos

# Copying source files
COPY database ./database
COPY app ./app
COPY commands ./commands
COPY config ./config
COPY contracts ./contracts
COPY database ./database
COPY providers ./providers
COPY start ./start
COPY .adonisrc.json ./
COPY .env.example ./
COPY ace ./
COPY server.ts ./
COPY tsconfig.json ./

# Building app
RUN yarn build
COPY .env.example ./build/.env

EXPOSE 3333

# Running the app
CMD node build/server
