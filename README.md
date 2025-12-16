# 📚 BiblioTec - Sistema de Gerenciamento de Biblioteca

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![License](https://img.shields.io/badge/License-MIT-blue)

> Um sistema web completo para gerenciamento de acervo, reservas e empréstimos de livros, desenvolvido com foco em experiência do usuário e arquitetura limpa.

---

## 🖼️ Demonstração Visual

| Tela de Login (Dark Mode) | Catálogo de Livros |
|:---:|:---:|
| ![Login](./screenshots/login.png) | ![Catalogo](./screenshots/catalogo.png) |

| Detalhes do Livro | Painel do Admin |
|:---:|:---:|
| ![Detalhes](./screenshots/detalhes.png) | ![Admin](./screenshots/admin.png) |

---

## 🚀 Sobre o Projeto

O **BiblioTec** foi desenvolvido como parte do curso de **Desenvolvimento de Sistemas no SENAI**. O objetivo é modernizar o processo de empréstimo de livros, permitindo que alunos reservem títulos online e que administradores gerenciem o acervo de forma eficiente.

### ✨ Principais Funcionalidades

#### 👤 Para o Aluno (Usuário):
- **Catálogo Interativo:** Busca em tempo real, filtros por categoria (Romance, Terror, Tecnologia) e carrossel de destaques.
- **Sistema de Login/Cadastro:** Autenticação segura com criptografia de senha e confirmação por e-mail.
- **Recuperação de Senha:** Envio de código de verificação via E-mail (**Nodemailer**).
- **Minhas Reservas:** Acompanhamento de status das solicitações.
- **Favoritos:** Lista personalizada de livros desejados.
- **Avaliações:** Sistema de 5 estrelas e comentários nos livros.
- **Dark Mode:** Tema escuro persistente.

#### 🛡️ Para o Administrador:
- **Gerenciamento de Livros:** Adicionar, editar e inativar títulos (CRUD).
- **Controle de Usuários:** Visualizar alunos cadastrados.
- **Gestão de Reservas:** Aprovar retiradas e confirmar devoluções.

---

## 🛠️ Tecnologias Utilizadas

### Front-end
- **HTML5 & CSS3:** Semântico e responsivo, usando Flexbox e Grid Layout.
- **JavaScript (ES6+):** Uso de Módulos (`import/export`), `async/await` e Fetch API.
- **CSS Variables:** Para gerenciamento fácil de temas (Claro/Escuro).

### Back-end
- **Node.js:** Ambiente de execução.
- **Express:** Framework para criação da API REST.
- **MySQL (MariaDB):** Banco de dados relacional.
- **JWT (Json Web Token):** Para autenticação e proteção de rotas.
- **Nodemailer:** Para envio de e-mails transacionais (Recuperação de senha/Boas-vindas).

---

## ⚙️ Como Rodar o Projeto Localmente

Siga os passos abaixo para executar o projeto na sua máquina:

### 1. Pré-requisitos
Tenha instalado:
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/) ou [XAMPP](https://www.apachefriends.org/)
- [Git](https://git-scm.com/)

### 2. Clonar o Repositório
```bash
git clone [https://github.com/SEU-USUARIO/BiblioTec.git](https://github.com/SEU-USUARIO/BiblioTec.git)
cd BiblioTec
