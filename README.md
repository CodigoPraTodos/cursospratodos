# Cursos pra Todos

📕 Plataforma de Cursos da Comunidade Código pra Todos.

## Descrição

🚀 Essa plataforma será destinada à criação e compartilhamento de cursos gratuitos feitos pelos coordenadores da CPT. No futuro planejamos abrir um espaço para cursos da comunidade também.

## Tarefas

👨‍💻 As tarefas serão realizadas mediante issues e PRs.
- Todo PR deve ter um issue relacionado a ele.
- Quando começar a trabalhar em um issue, deve-se comentar isso nele e manter o status do issue (ou outra pessoa poderá fazer-lo).
- Todo PR deve ter testes automatizados, deve estar direcionando à branch `development`, e deve ter pelo menos uma aprovação do time CPT antes de realizar merge.
- Após o merge, deve-se encerrar o issue, testar todas as funcionalidades de forma manual e depois fazer o merge ao master.

## Serviços (Em progresso)

- 🖥 [nodejs-api](nodejs-api) - API Geral para servir principais serviços da plataforma.
- 📱 [react-native-app-web](react-native-app-web) - Frontend Web/App mobile para buscar e realizar cursos, áreas de usuário, etc. (Usar React Native Web com Next.js para SSR, e ao mesmo tempo usar pra aplicativo principal)

## Serviços (Planejados)

- 👨‍🏫 [react-web-instructor](react-web-instructor) - Frontend Web para CRUDs de cursos, exercícios, relatórios, etc. (podemos usar o mesmo react native web sem SSR)
- 👨‍🔧 [react-web-admin](react-web-admin) - Frontend Web para administração do sistema, cadastro de instrutores, etc. (podemos usar o mesmo react native web sem SSR)
- ✍️ [exercises-lambda](exercises-lambda) - Serviços Servless para testes de exercícios realizados durante a aula.
