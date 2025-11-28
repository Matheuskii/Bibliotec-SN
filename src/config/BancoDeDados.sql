-- ===========================================================
-- CRIAÇÃO DO BANCO DE DADOS
-- ===========================================================
CREATE DATABASE IF NOT EXISTS dblivraria;
USE dblivraria;

-- ===========================================================
-- TABELA DE USUÁRIOS
-- ===========================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(100) NOT NULL,
  data_nascimento DATE,
  celular VARCHAR(20),
  curso VARCHAR(100),
  perfil ENUM('Aluno', 'Admin') DEFAULT 'Aluno'
);

-- ===========================================================
-- DADOS DE USUÁRIOS
-- ===========================================================
INSERT INTO usuarios (nome, email, senha, perfil) VALUES
('Vitor Lima', 'vitor.lima@email.com', '1234', 'Admin'),
('Pedro Campos', 'pedro.campos@email.com', 'abcd', 'Aluno'),
('Pedro Gabriel', 'pedro.gabriel@email.com', 'senha123', 'Aluno'),
('Davi Guedes', 'davi.guedes@email.com', 'teste123', 'Aluno'),
('Matheus Lima', 'matheus.lima@email.com', '3210', 'Aluno');

-- ===========================================================
-- TABELA DE LIVROS
-- ===========================================================
CREATE TABLE IF NOT EXISTS livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    genero VARCHAR(100),
    editora VARCHAR(100),
    ano_publicacao SMALLINT,
    isbn VARCHAR(20),
    idioma VARCHAR(50) DEFAULT 'Português',
    formato ENUM('Físico', 'E-book', 'Audiobook') DEFAULT 'Físico',
    caminho_capa VARCHAR(255),
    sinopse TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===========================================================
-- DADOS DE LIVROS
-- ===========================================================
INSERT INTO livros (titulo, autor, genero, editora, ano_publicacao, isbn, idioma, formato, caminho_capa, sinopse)
VALUES
('Filhas da Lua', 'Carolina França', 'Fantasia / Romance', 'Pandorga', 2018, '9788568263952', 'Português', 'Físico', 'capas/filhasdalua.jpg', 'Trilogia sobre jovens com poderes lunares e uma antiga profecia.'),
('TI para Negócios', 'Edson Perin', 'Tecnologia / Gestão', 'M. Books', 2010, '9788578271541', 'Português', 'E-book', 'capas/tiparanegocios.jpg', 'Mostra como a TI pode impulsionar resultados empresariais.'),
('Mestres do Tempo', 'R. V. Campbell', 'Ficção Científica', 'Arqueiro', 2017, '9788580417432', 'Português', 'Físico', 'capas/mestresdotempo.jpg', 'Explora viagens no tempo e dilemas morais sobre alterar o passado.'),
('O Código Limpo', 'Robert C. Martin', 'Tecnologia / Programação', 'Alta Books', 2009, '9788576082675', 'Português', 'Físico', 'capas/codigolimpo.jpg', 'Guia essencial sobre boas práticas e padrões de código limpo.'),
('Dom Casmurro', 'Machado de Assis', 'Romance Clássico', 'Principis', 1899, '9788580574463', 'Português', 'Físico', 'capas/domcasmurro.jpg', 'Um dos maiores clássicos da literatura brasileira, explorando ciúme e ambiguidade.'),
('O Capital – Volume I', 'Karl Marx', 'Economia / Política', 'Boitempo', 1867, '9788575596821', 'Português', 'Físico', 'capas/ocapital1.jpg', 'Uma análise profunda do capitalismo, suas relações de trabalho e mecanismos de exploração.'),
('Manifesto do Partido Comunista', 'Karl Marx & Friedrich Engels', 'Política / História', 'Boitempo', 1848, '9788575590003', 'Português', 'Físico', 'capas/manifestocomunista.jpg', 'Texto fundamental que apresenta as bases do comunismo e a crítica à sociedade burguesa.'),
('A Ideologia Alemã', 'Karl Marx & Friedrich Engels', 'Filosofia / Política', 'Boitempo', 1846, '9788575592151', 'Português', 'E-book', 'capas/ideologiaalema.jpg', 'Discussão sobre materialismo histórico e crítica aos jovens hegelianos.'),
('Genealogia da Moral', 'Friedrich Nietzsche', 'Filosofia', 'Companhia das Letras', 1887, '9788535930528', 'Português', 'Físico', 'capas/genealogiamoral.jpg', 'Uma investigação crítica sobre os valores morais e sua origem histórica.'),
('Assim Falou Zaratustra', 'Friedrich Nietzsche', 'Filosofia', 'Companhia das Letras', 1883, '9788535927207', 'Português', 'Físico', 'capas/zaratustra.jpg', 'Obra poético-filosófica que discute o além-do-homem e a superação dos valores tradicionais.'),
('A Ética Protestante e o Espírito do Capitalismo', 'Max Weber', 'Sociologia / Economia', 'Pioneira', 1905, '9788522104928', 'Português', 'Físico', 'capas/weberetica.jpg', 'Estudo clássico sobre a relação entre protestantismo, racionalidade e capitalismo moderno.'),
('Vigiar e Punir', 'Michel Foucault', 'Filosofia / Sociologia', 'Vozes', 1975, '9788532616210', 'Português', 'Físico', 'capas/vigiarepunir.jpg', 'Análise histórica do sistema penal e das formas de controle social.'),
('A História da Loucura', 'Michel Foucault', 'Filosofia / História', 'Perspectiva', 1961, '9788527302848', 'Português', 'Físico', 'capas/historialoucura.jpg', 'Explora como a sociedade construiu e tratou a "loucura" ao longo dos séculos.'),
('Teoria Geral do Emprego, do Juro e da Moeda', 'John Maynard Keynes', 'Economia', 'Nova Fronteira', 1936, '9788520922951', 'Português', 'Físico', 'capas/keynes.jpg', 'Fundamento da macroeconomia moderna e das políticas de intervenção estatal.'),
('A Riqueza das Nações', 'Adam Smith', 'Economia / Filosofia', 'Martin Claret', 1776, '9788572328227', 'Português', 'Físico', 'capas/riquezanascoes.jpg', 'Obra fundadora da economia clássica e do liberalismo econômico.'),
('O Príncipe', 'Nicolau Maquiavel', 'Política / Filosofia', 'Martin Claret', 1532, '9788572328548', 'Português', 'Físico', 'capas/oprincipe.jpg', 'Análise pragmática sobre poder, liderança e estratégia política.'),
('A República', 'Platão', 'Filosofia', 'Martin Claret', 380, '9788572327503', 'Português', 'Físico', 'capas/arepublica.jpg', 'Discussão sobre justiça, política e organização ideal da sociedade.'),
('Meditações', 'Marco Aurélio', 'Filosofia Estoica', 'Penguin', 180, '9788563560872', 'Português', 'Físico', 'capas/meditacoes.jpg', 'Reflexões do imperador romano sobre virtude, controle emocional e vida.');

-- ===========================================================
-- TABELA DE AVALIAÇÕES
-- ===========================================================
CREATE TABLE IF NOT EXISTS avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    livro_id INT NOT NULL,
    nota DECIMAL(2,1) CHECK (nota >= 0 AND nota <= 5),
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
);

-- ===========================================================
-- DADOS DE AVALIAÇÕES
-- ===========================================================
INSERT INTO avaliacoes (usuario_id, livro_id, nota, comentario)
VALUES
(1, 1, 5.0, 'História envolvente e personagens cativantes.'),
(2, 1, 4.5, 'Ótima leitura, final surpreendente.'),
(3, 2, 4.0, 'Excelente abordagem sobre tecnologia e negócios.'),
(1, 4, 5.0, 'Leitura obrigatória para todo desenvolvedor.'),
(2, 3, 3.5, 'Ideia interessante, mas um pouco confusa em alguns trechos.'),
(3, 5, 4.8, 'Um clássico atemporal, narrativa impecável.');

-- ===========================================================
-- TABELA DE RESERVAS
-- ===========================================================
CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    livro_id INT NOT NULL,
    data_retirada DATE NOT NULL,
    data_devolucao DATE NOT NULL,
    confirmado_email BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
);

-- ===========================================================
-- TABELA DE FAVORITOS
-- ===========================================================
CREATE TABLE IF NOT EXISTS favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    livro_id INT NOT NULL,
    data_favoritado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
);
