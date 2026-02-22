# 📚 BiblioTec - Estrutura do Projeto

## 📁 Estrutura Organizada

```
BiblioTec/
├── frontend/
│   ├── index.html           # (Future) Landing page
│   ├── login.html           # Página de login
│   ├── cadastro.html        # Página de cadastro
│   ├── novaSenha.html       # Recuperação de senha
│   ├── inicio.html          # Página principal
│   ├── catalogo.html        # Catálogo de livros
│   │
│   ├── css/
│   │   ├── login.css        # Estilos login/cadastro/recuperação
│   │   ├── cadastro.css     # Importa login.css
│   │   ├── novaSenha.css    # Importa login.css
│   │   ├── inicio.css       # Estilos página inicial
│   │   └── catalogo.css     # Estilos catálogo
│   │
│   ├── js/
│   │   ├── app.js           # Funções compartilhadas (login, carrossel)
│   │   └── catalogo.js      # Funções do catálogo
│   │
│   ├── capas/               # Capas dos livros
│   └── images/              # Imagens gerais
│
└── src/
    ├── server.js            # Servidor Express
    ├── config/
    │   ├── db.js            # Configuração do banco
    │   └── BancoDeDados.sql # Schema do BD
    ├── controllers/
    │   ├── usuario.controller.js
    │   ├── livros.controller.js
    │   ├── favoritos.controller.js
    │   ├── reservas.controller.js
    │   └── avaliacoes.controller.js
    └── routes/
        ├── usuario.routes.js
        ├── livros.routes.js
        ├── favoritos.routes.js
        ├── reservas.routes.js
        └── avaliacao.routes.js
```

## 🎨 Padrão de Nomenclatura

- **HTML**: lowercase com hífens (ex: `novaSenha.html` → será `novasenha.html`)
- **CSS**: lowercase (ex: `login.css`, `catalogo.css`)
- **JavaScript**: lowercase camelCase (ex: `app.js`, `catalogo.js`)
- **Classes CSS**: kebab-case (ex: `.btn-login`, `.filter-btn`)

## 🔗 Relações entre Arquivos

### Login/Cadastro/Recuperação

- Compartilham estilos via `login.css`
- Usam funções do `app.js`

### Início

- Carrega livros via API
- Usa carrossel do `app.js`

### Catálogo

- Carrega livros via API
- Sistema de filtros próprio
- Estilos dedicados

## 🚀 Como Rodar

```bash
# Backend
cd src
npm install
npm start

# Frontend
Abrir em navegador: CLIENT_URL
```

## 📝 Endpoints da API

- `POST /usuarios/login` - Login
- `POST /usuarios/cadastrar` - Cadastro
- `POST /usuarios/newpass` - Recuperar senha
- `GET /livros` - Listar livros
- `POST /favoritos` - Adicionar favorito
- `GET /reservas` - Listar reservas
- `POST /avaliacoes` - Adicionar avaliaçãoa
