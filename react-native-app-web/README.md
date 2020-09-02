# Cursos Pra Todos Web - Aluno

🚀 Web principal do app Cursos pra todos. (Alunos)

## Ferramentas/Links para ajuda

[Node.js 12](https://nodejs.org/en/)

[Yarn Classic](https://classic.yarnpkg.com/lang/en/)

[API (Node.js)](https://github.com/CodigoPraTodos/cursospratodos/tree/master/nodejs-api)

[Expo](https://expo.io/)

[Expo Web](https://docs.expo.io/workflow/web/)

[Expo + Next.js](https://docs.expo.io/guides/using-nextjs/)

[React Native Paper + Web](https://callstack.github.io/react-native-paper/using-on-the-web.html)

[Mais info sobre Expo + Next.js](https://github.com/expo/examples/tree/master/with-nextjs)

[Ainda mais info sobre Expo + Next.js](https://github.com/expo/expo/blob/master/docs/pages/guides/using-nextjs.md)

## Instalação

Você precisará ter ao menos o NodeJS instalado na versão indicada acima e o classic yarn (V1) para controle de pacotes.

```bash
# Instale as dependências com yarn (por conta do yarn.lock)
yarn

# Copie e edite as configs locais (incluindo URL pro backend local/staging/prod/...)
# Expo nao suporta .env totalmente, então preferi usar config.js para não ter problemas entre Web/Mobile
cp config.example.js config.js && vi config.js # pode usar seu editor preferido

# Execute o App
yarn start     # Web
yarn start:app # Expo
```
