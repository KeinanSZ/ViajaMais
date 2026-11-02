# ViajaMais

Projeto desenvolvido nas aulas de Laboratório de Programação Front-End, usando React, TypeScript, Vite, React Router e Axios.

O ViajaMais apresenta destinos de viagem, pesquisa e filtros por categoria, detalhes de ofertas ilustrativas, formulário de contato, autenticação e uma lista de desejos.

## Como executar

É necessário ter Node.js e npm instalados. Na pasta do projeto, execute:

```bash
npm install
npm run dev
```

Abra no navegador o endereço informado pelo Vite.

Para verificar o código e gerar a versão de produção:

```bash
npm run lint
npm run build
```

## Login de demonstração

- Usuário: `emilys`
- Senha: `emilyspass`

O login e a consulta da sessão usam a API DummyJSON. É necessário estar conectado à internet.

## Lista de desejos e CRUD

A página **Meus desejos** usa o recurso `/todos` da DummyJSON:

- GET `/todos/user/{userId}`: lista os desejos do usuário autenticado.
- POST `/todos/add`: cria um desejo com `todo`, `completed` e `userId`.
- PATCH `/todos/{id}`: marca um desejo como realizado ou pendente.
- DELETE `/todos/{id}`: exclui um desejo após confirmação.

A tela contempla carregamento, erro, lista vazia e lista com itens, validação do formulário, busca local, botão desabilitado durante o envio e atualização do estado React sem recarregar a página.

**Importante:** a DummyJSON simula as operações de escrita e não persiste as alterações. Por isso, os itens criados durante a sessão ficam no estado local. O projeto identifica esses itens e não tenta editar ou excluir na API IDs que o servidor não conhece. Ao atualizar a página, a lista volta aos dados existentes na API, conforme explicado no material da Aula 10.

Os destinos marcados com o coração na página inicial continuam disponíveis na seção **Destinos salvos** da página de desejos. Essa seleção de favoritos é mantida no Context do React durante a sessão.

## Autenticação e tratamento de erros

O `AuthContext` mantém usuário, token, carregamento, login e logout. O Axios adiciona o token Bearer automaticamente às requisições protegidas. Se uma resposta protegida retornar HTTP 401, o interceptor encerra a sessão e a rota protegida redireciona para o login. O erro 401 da própria rota `/auth/login` não dispara logout, pois representa credenciais inválidas.

A função `src/utils/erros.ts` centraliza mensagens para HTTP 400, 401, 404, 5xx, timeout, falha de conexão e erros inesperados. As operações do CRUD usam `try/catch/finally`, exibem mensagens na tela com `role="alert"` e permitem tentar novamente quando uma operação falha.

## Responsividade

O layout usa uma base mobile-first, com uma coluna em telas estreitas e expansão progressiva com media queries a partir de 40rem e 64rem. Campos e botões têm alvos de toque confortáveis, imagens fluidas e a meta viewport configurada no `index.html`.

Para conferir o celular no navegador, abra as ferramentas do desenvolvedor, ative o modo dispositivo (`Ctrl+Shift+M`) e teste a largura de 375 px. Verifique se não há rolagem horizontal.

## Tecnologias e conceitos

- React e TypeScript;
- `useState`, `useEffect`, `useMemo`, `useRef` e Context API;
- imutabilidade com spread, `map` e `filter`;
- `fetch` para consultar dados públicos da Wikipedia;
- Axios, services e interceptors;
- React Router e rota protegida;
- CRUD com GET, POST, PATCH e DELETE;
- validação, estados de carregamento e tratamento de erros;
- CSS mobile-first, Flexbox, Grid, media queries e `clamp()`.

Os destinos consultam dados públicos da Wikipedia. Valores de ofertas e estimativas apresentados no site são ilustrativos, não preços reais de passagens ou hospedagens. O formulário de contato é uma demonstração local e não envia dados para um servidor.

## Integrantes

Maycon Douglas e Keinan Souza.
