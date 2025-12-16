**Bibliotec-SN**

Projeto de uma aplicação simples de gestão de biblioteca (back-end em Node.js + frontend estático), desenvolvido como trabalho escolar/atividade prática. O repositório contém a API, controladores, rotas, configuração de banco de dados e páginas frontend estáticas.

**Funcionalidades**
- **CRUD Livros:** Endpoints para listar, cadastrar, editar e excluir livros (via `routes/livros.routes.js`).
- **Usuários:** Rotas e controladores para cadastro e autenticação de usuários (em `controllers/usuario.controller.js` e `routes/usuario.routes.js`).
- **Reservas & Favoritos:** Funcionalidades para reservar livros e marcar favoritos (`controllers/reservas.controller.js`, `controllers/favoritos.controller.js`).
- **Avaliações:** Sistema de avaliações para livros (`controllers/avaliacoes.controller.js`, `routes/avaliacao.routes.js`).

**Tecnologias**
- **Runtime:** `Node.js` (ESM - `type: "module"` no `package.json`).
- **Framework:** `Express`
- **Banco de dados:** MariaDB/MySQL (driver `mysql2`).
- **Frontend:** Páginas HTML/CSS/JS estáticas em `frontend/`.

**Pré-requisitos**
- `Node.js` (versão compatível com ESM)
- MariaDB ou MySQL em execução (ou use um servidor de banco compatível)

**Instalação**
1. Clone o repositório ou copie os arquivos para sua máquina.
2. No terminal (PowerShell) rode:

```
cd "c:\Users\mahme\OneDrive\Documents\Matheus\REPO\Bibliotec-SN"
npm install
```

3. Configure a conexão com o banco de dados editando `config/db.js` (defina host, usuário, senha, database). O script de criação do banco e tabelas está em `config/BancoDeDados.sql`.

**Como executar**
- Para iniciar o servidor (API):

```
npm start
```

Isso executa `node src/server.js` conforme script `start` do `package.json`.

- O frontend é estático: abra os arquivos em `frontend/` no navegador (ex.: `frontend/Inicio.html`, `frontend/Catalogo.html`, `frontend/Cadastro.html`, `frontend/Login.html`).

**Estrutura do Projeto (resumo)**
- **`src/`**: código do servidor (entry: `src/server.js`).
- **`controllers/`**: controladores da aplicação (`usuario`, `livros`, `reservas`, `favoritos`, `avaliacoes`).
- **`routes/`**: definição de rotas para a API.
- **`config/`**: `db.js` (conexão com DB) e `BancoDeDados.sql` (script SQL).
- **`frontend/`**: páginas estáticas, CSS e scripts JS.

**Rotas principais**
- Rotas de livros: definidas em `routes/livros.routes.js` (use para operações CRUD de livros).
- Rotas de usuário: `routes/usuario.routes.js` (cadastro/login/recuperação).
- Reservas, favoritos e avaliações: rotas correspondentes em `routes/`.

**Notas sobre configuração**
- Antes de iniciar, verifique as credenciais no `config/db.js` e adapte ao seu ambiente local.
- Se usar MariaDB/MySQL remoto, abra a porta e ajuste host/usuario/senha.

**Contribuindo**
- Faça fork/clone, crie uma branch, implemente alterações e abra um pull request.
- Para issues ou dúvidas, use o mecanismo de Issues do repositório GitHub ou entre em contato com o autor do projeto.

**Licença**
- Não especificada no repositório. Adicione um arquivo `LICENSE` se quiser declarar uma licença

