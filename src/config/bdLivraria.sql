-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           12.0.2-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para dblivraria
CREATE DATABASE IF NOT EXISTS `dblivraria` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `dblivraria`;

-- Copiando estrutura para tabela dblivraria.avaliacoes
CREATE TABLE IF NOT EXISTS `avaliacoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `livro_id` int(11) NOT NULL,
  `nota` decimal(2,1) DEFAULT NULL CHECK (`nota` >= 0 and `nota` <= 5),
  `comentario` text DEFAULT NULL,
  `data_avaliacao` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `livro_id` (`livro_id`),
  CONSTRAINT `avaliacoes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `avaliacoes_ibfk_2` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela dblivraria.avaliacoes: ~5 rows (aproximadamente)
INSERT INTO `avaliacoes` (`id`, `usuario_id`, `livro_id`, `nota`, `comentario`, `data_avaliacao`) VALUES
	(1, 1, 1, 5.0, 'História envolvente e personagens cativantes.', '2025-10-31 11:37:09'),
	(4, 1, 4, 5.0, 'Leitura obrigatória para todo desenvolvedor.', '2025-10-31 11:37:09'),
	(5, 2, 3, 3.5, 'Ideia interessante, mas um pouco confusa em alguns trechos.', '2025-10-31 11:37:09'),
	(6, 3, 5, 4.8, 'Um clássico atemporal, narrativa impecável.', '2025-10-31 11:37:09'),
	(7, 5, 7, 5.0, 'Perfeito.', '2025-11-12 12:32:20');

-- Copiando estrutura para tabela dblivraria.favoritos
CREATE TABLE IF NOT EXISTS `favoritos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `livro_id` int(11) NOT NULL,
  `data_favoritado` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `livro_id` (`livro_id`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela dblivraria.favoritos: ~1 rows (aproximadamente)
INSERT INTO `favoritos` (`id`, `usuario_id`, `livro_id`, `data_favoritado`) VALUES
	(2, 2, 4, '2025-11-18 13:15:30');

-- Copiando estrutura para tabela dblivraria.livros
CREATE TABLE IF NOT EXISTS `livros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `autor` varchar(100) NOT NULL,
  `genero` varchar(100) DEFAULT NULL,
  `editora` varchar(100) DEFAULT NULL,
  `ano_publicacao` smallint(6) DEFAULT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `idioma` varchar(50) DEFAULT 'Português',
  `formato` enum('Físico','E-book','Audiobook') DEFAULT 'Físico',
  `caminho_capa` varchar(255) DEFAULT NULL,
  `sinopse` text DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `criado_em` timestamp NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela dblivraria.livros: ~83 rows (aproximadamente)
INSERT INTO `livros` (`id`, `titulo`, `autor`, `genero`, `editora`, `ano_publicacao`, `isbn`, `idioma`, `formato`, `caminho_capa`, `sinopse`, `ativo`, `criado_em`, `atualizado_em`) VALUES
	(1, 'Filhas da Lua', 'Carolina França', 'Fantasia / Romance', 'Pandorga', 2018, '9788568263952', 'Português', 'Físico', 'capas/filhasdalua.jpg', 'Trilogia sobre jovens com poderes lunares e uma antiga profecia.', 1, '2025-10-31 11:36:59', '2025-10-31 11:36:59'),
	(3, 'Mestres do Tempo', 'R. V. Campbell', 'Ficção Científica', 'Arqueiro', 2017, '9788580417432', 'Português', 'Físico', 'capas/mestresdotempo.jpg', 'Explora viagens no tempo e dilemas morais sobre alterar o passado.', 1, '2025-10-31 11:36:59', '2025-10-31 11:36:59'),
	(4, 'O Código Limpo', 'Robert C. Martin', 'Tecnologia / Programação', 'Alta Books', 2009, '9788576082675', 'Português', 'Físico', 'capas/codigolimpo.jpg', 'Guia essencial sobre boas práticas e padrões de código limpo.', 1, '2025-10-31 11:36:59', '2025-10-31 11:36:59'),
	(5, 'Dom Casmurro', 'Machado de Assis', 'Romance Clássico', 'Principis', 1899, '9788580574463', 'Português', 'Físico', 'capas/domcasmurro.jpg', 'Um dos maiores clássicos da literatura brasileira, explorando ciúme e ambiguidade.', 1, '2025-10-31 11:36:59', '2025-10-31 11:36:59'),
	(7, 'A Revolução dos Bichos', 'George Orwell', NULL, NULL, NULL, NULL, 'Português', 'Físico', 'capas/revolucao.jpg', NULL, 1, '2025-11-12 11:38:53', '2025-11-26 12:34:33'),
	(9, 'O Capital – Volume I', 'Karl Marx', 'Economia / Política', 'Boitempo', 1867, '9788575596821', 'Português', 'Físico', 'capas/ocapital1.jpg', 'Uma análise profunda do capitalismo, suas relações de trabalho e mecanismos de exploração.', 1, '2025-11-26 13:27:51', '2025-11-26 13:27:51'),
	(10, 'Manifesto do Partido Comunista', 'Karl Marx & Friedrich Engels', 'Política / História', 'Boitempo', 1848, '9788575590003', 'Português', 'Físico', 'capas/manifestocomunista.jpg', 'Texto fundamental que apresenta as bases do comunismo e a crítica à sociedade burguesa.', 1, '2025-11-26 13:27:51', '2025-11-26 13:27:51'),
	(11, 'A Ideologia Alemã', 'Karl Marx & Friedrich Engels', 'Filosofia / Política', 'Boitempo', 1846, '9788575592151', 'Português', 'E-book', 'capas/ideologiaalema.jpg', 'Discussão sobre materialismo histórico e crítica aos jovens hegelianos.', 1, '2025-11-26 13:27:51', '2025-11-26 13:27:51'),
	(12, 'Genealogia da Moral', 'Friedrich Nietzsche', 'Filosofia', 'Companhia das Letras', 1887, '9788535930528', 'Português', 'Físico', 'capas/genealogiamoral.jpg', 'Uma investigação crítica sobre os valores morais e sua origem histórica.', 1, '2025-11-26 13:27:51', '2025-11-26 13:27:51'),
	(13, 'Assim Falou Zaratustra', 'Friedrich Nietzsche', 'Filosofia', 'Companhia das Letras', 1883, '9788535927207', 'Português', 'Físico', 'capas/zaratustra.jpg', 'Obra poético-filosófica que discute o além-do-homem e a superação dos valores tradicionais.', 1, '2025-11-26 13:27:51', '2025-11-26 13:27:51'),
	(14, 'A Ética Protestante e o Espírito do Capitalismo', 'Max Weber', 'Sociologia / Economia', 'Pioneira', 1905, '9788522104928', 'Português', 'Físico', 'capas/weberetica.jpg', 'Estudo clássico sobre a relação entre protestantismo, racionalidade e capitalismo moderno.', 1, '2025-11-26 13:27:51', '2025-11-26 13:27:51'),
	(15, 'Vigiar e Punir', 'Michel Foucault', 'Filosofia / Sociologia', 'Vozes', 1975, '9788532616210', 'Português', 'Físico', 'capas/vigiarepunir.jpg', 'Análise histórica do sistema penal e das formas de controle social.', 1, '2025-11-26 13:27:51', '2025-11-26 13:27:51'),
	(16, 'A História da Loucura', 'Michel Foucault', 'Filosofia / História', 'Perspectiva', 1961, '9788527302848', 'Português', 'Físico', 'capas/historialoucura.jpg', 'Explora como a sociedade construiu e tratou a “loucura” ao longo dos séculos.', 1, '2025-11-26 13:27:51', '2025-11-26 13:27:51'),
	(17, 'Teoria Geral do Emprego, do Juro e da Moeda', 'John Maynard Keynes', 'Economia', 'Nova Fronteira', 1936, '9788520922951', 'Português', 'Físico', 'capas/keynes.jpg', 'Fundamento da macroeconomia moderna e das políticas de intervenção estatal.', 1, '2025-11-26 13:27:51', '2025-11-26 13:27:51'),
	(18, 'A Riqueza das Nações', 'Adam Smith', 'Economia / Filosofia', 'Martin Claret', 1776, '9788572328227', 'Português', 'Físico', 'capas/riquezanascoes.jpg', 'Obra fundadora da economia clássica e do liberalismo econômico.', 1, '2025-11-26 13:27:51', '2025-11-26 13:27:51'),
	(19, 'O Príncipe', 'Nicolau Maquiavel', 'Política / Filosofia', 'Martin Claret', 1532, '9788572328548', 'Português', 'Físico', 'capas/oprincipe.jpg', 'Análise pragmática sobre poder, liderança e estratégia política.', 1, '2025-11-26 13:27:51', '2025-11-26 13:27:51'),
	(20, 'A República', 'Platão', 'Filosofia', 'Martin Claret', 380, '9788572327503', 'Português', 'Físico', 'capas/arepublica.jpg', 'Discussão sobre justiça, política e organização ideal da sociedade.', 1, '2025-11-26 13:27:51', '2025-11-26 13:27:51'),
	(21, 'Meditações', 'Marco Aurélio', 'Filosofia Estoica', 'Penguin', 180, '9788563560872', 'Português', 'Físico', 'capas/meditacoes.jpg', 'Reflexões do imperador romano sobre virtude, controle emocional e vida.', 1, '2025-11-26 13:27:51', '2025-11-26 13:27:51'),
	(35, 'O Hobbit', 'J.R.R. Tolkien', 'Fantasia', 'HarperCollins', 1937, '9780261102217', 'Português', 'Físico', 'capas/hobbit.jpg', 'Bilbo Bolseiro embarca em uma jornada inesperada com anões.', 1, '2025-12-01 12:25:43', '2025-12-01 14:07:35'),
	(36, 'As Crônicas de Nárnia', 'C.S. Lewis', 'Fantasia', 'HarperCollins', 1950, '9780064471190', 'Português', 'E-book', 'capas/narnia.jpg', 'Crianças descobrem um mundo mágico através de um guarda-roupa.', 1, '2025-12-01 12:25:43', '2025-12-01 14:07:51'),
	(37, 'Eragon', 'Christopher Paolini', 'Fantasia', 'Rocco', 2003, '9780375826696', 'Português', 'Físico', 'capas/eragon.jpg', 'Garoto encontra um ovo de dragão que muda sua vida.', 1, '2025-12-01 12:25:43', '2025-12-01 14:08:00'),
	(38, 'A Roda do Tempo: O Olho do Mundo', 'Robert Jordan', 'Fantasia', 'Intrínseca', 1990, '9788595086432', 'Português', 'Físico', 'capas/olho-do-mundo.jpg', 'A jornada para combater uma força maligna ancestral.', 1, '2025-12-01 12:25:43', '2025-12-01 14:08:04'),
	(39, 'Mistborn', 'Brandon Sanderson', 'Fantasia', 'Tor Books', 2006, '9780765311788', 'Inglês', 'E-book', 'capas/mistborn.jpg', 'Um mundo dominado pelas cinzas e um grupo tenta derrubar o tirano supremo.', 1, '2025-12-01 12:25:43', '2025-12-01 14:08:09'),
	(40, 'Percy Jackson e o Ladrão de Raios', 'Rick Riordan', 'Fantasia', 'Intrínseca', 2005, '9780786856299', 'Português', 'Físico', 'capas/percy1.jpg', 'Jovem descobre ser filho de um deus grego.', 1, '2025-12-01 12:25:43', '2025-12-01 14:08:16'),
	(41, 'O Nome do Vento', 'Patrick Rothfuss', 'Fantasia', 'Arqueiro', 2007, '9788599296493', 'Português', 'Físico', 'capas/nome-do-vento.jpg', 'A história de Kvothe, um mago lendário.', 1, '2025-12-01 12:25:43', '2025-12-01 14:08:25'),
	(42, 'A Canção de Aquiles', 'Madeline Miller', 'Fantasia', 'Planeta', 2011, '9780062060624', 'Português', 'E-book', 'capas/cancao-de-aquiles.jpg', 'Reconta a Ilíada através do olhar de Pátroclo.', 1, '2025-12-01 12:25:43', '2025-12-01 14:08:30'),
	(43, 'O Lar da Srta. Peregrine', 'Ransom Riggs', 'Fantasia', 'Leya', 2011, '9781594744761', 'Português', 'Físico', 'capas/peregrine.jpg', 'Um garoto descobre um orfanato com crianças peculiares.', 1, '2025-12-01 12:25:43', '2025-12-01 14:08:34'),
	(44, 'Sombra e Ossos', 'Leigh Bardugo', 'Fantasia', 'Planeta', 2012, '9788580411461', 'Português', 'E-book', 'capas/sombra-e-ossos.jpg', 'Uma órfã descobre um poder raro que pode salvar seu país.', 1, '2025-12-01 12:25:43', '2025-12-01 14:08:38'),
	(45, 'Capitães da Areia', 'Jorge Amado', 'Drama', 'Companhia das Letras', 1937, '9788520929183', 'Português', 'Físico', 'capas/capitaes.jpg', 'Meninos abandonados sobrevivem nas ruas de Salvador.', 1, '2025-12-01 12:25:43', '2025-12-01 14:08:42'),
	(46, 'Vidas Secas', 'Graciliano Ramos', 'Drama', 'Record', 1938, '9788501008864', 'Português', 'E-book', 'capas/vidas-secas.jpg', 'Família de retirantes enfrenta a seca nordestina.', 1, '2025-12-01 12:25:43', '2025-12-01 14:08:46'),
	(47, 'O Alto da Compadecida', 'Ariano Suassuna', 'Comédia', 'Agir', 1955, '9788522004987', 'Português', 'Físico', 'capas/compadecida.jpg', 'João Grilo e Chicó aprontam no sertão.', 1, '2025-12-01 12:25:43', '2025-12-01 14:08:49'),
	(48, 'A Hora da Estrela', 'Clarice Lispector', 'Drama', 'Rocco', 1977, '9788532511010', 'Português', 'Físico', 'capas/hora-estrela.jpg', 'A vida simples e trágica de Macabéa.', 1, '2025-12-01 12:25:43', '2025-12-01 14:08:54'),
	(49, 'Turma da Mônica – Laços', 'Vitor Cafaggi', 'Quadrinhos', 'Panini', 2013, '9788583680789', 'Português', 'Físico', 'capas/lacos.jpg', 'Os personagens buscam o Floquinho desaparecido.', 1, '2025-12-01 12:25:43', '2025-12-01 14:08:58'),
	(50, 'O Auto da Barca do Inferno', 'Gil Vicente', 'Teatro', 'FDT', 1517, '9789722723732', 'Português', 'E-book', 'capas/barca-inferno.jpg', 'Sátira moral sobre julgamento das almas.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:01'),
	(51, 'Torto Arado', 'Itamar Vieira Junior', 'Romance', 'Todavia', 2019, '9788593824661', 'Português', 'Físico', 'capas/torto-arado.jpg', 'Duas irmãs descobrem um segredo que muda suas vidas.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:05'),
	(52, 'Memórias Póstumas de Brás Cubas', 'Machado de Assis', 'Romance', 'Antofágica', 1881, '9786585405021', 'Português', 'Físico', 'capas/bras-cubas.jpg', 'Um defunto autor narra sua própria história.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:08'),
	(53, 'Quarto de Despejo', 'Carolina Maria de Jesus', 'Drama', 'Ática', 1960, '9788508021804', 'Português', 'E-book', 'capas/quarto-despejo.jpg', 'Diários de uma mulher na favela do Canindé.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:11'),
	(54, 'A Marca de uma Lágrima', 'Pedro Bandeira', 'Juvenil', 'Moderna', 1985, '9788516013778', 'Português', 'Físico', 'capas/marca-lagrima.jpg', 'Raquel precisa lidar com amor, amizade e mistérios.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:14'),
	(55, 'A Culpa é das Estrelas', 'John Green', 'Romance', 'Intrínseca', 2012, '9780062853721', 'Português', 'E-book', 'capas/culpa-estrelas.jpg', 'Dois jovens com câncer vivem um romance emocionante.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:17'),
	(56, 'O Código Da Vinci', 'Dan Brown', 'Suspense', 'Arqueiro', 2003, '9780385504201', 'Português', 'Físico', 'capas/codigo-vinci.jpg', 'Um simbologista desvende um segredo milenar.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:21'),
	(57, 'A Garota no Trem', 'Paula Hawkins', 'Suspense', 'Record', 2015, '9780385682312', 'Português', 'E-book', 'capas/garota-trem.jpg', 'Mulher presencia algo estranho pela janela do trem.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:24'),
	(58, 'Crepúsculo', 'Stephenie Meyer', 'Fantasia', 'Intrínseca', 2005, '9780316160179', 'Português', 'Físico', 'capas/crepusculo.jpg', 'Humana se apaixona por um vampiro.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:27'),
	(59, 'O Alquimista', 'Paulo Coelho', 'Ficção', 'HarperCollins', 1988, '9780061122415', 'Português', 'Físico', 'capas/o-alquimista.jpg', 'Pastor busca seu destino em uma jornada espiritual.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:30'),
	(60, 'O Menino do Pijama Listrado', 'John Boyne', 'Drama', 'Companhia das Letras', 2006, '9788478887881', 'Português', 'Físico', 'capas/pijama-listrado.jpg', 'Um garoto faz amizade com um menino em um campo de concentração.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:33'),
	(61, 'A Paciente Silenciosa', 'Alex Michaelides', 'Suspense', 'Record', 2019, '9781250301697', 'Português', 'E-book', 'capas/paciente-silenciosa.jpg', 'Mulher que para de falar após um crime misterioso.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:36'),
	(63, 'A Cinco Passos de Você', 'Rachael Lippincott', 'Romance', 'Globo', 2018, '9788580576061', 'Português', 'E-book', 'capas/cinco-passos.jpg', 'Dois jovens com fibrose cística vivem um amor proibido.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:39'),
	(64, 'A Menina que Roubava Livros', 'Markus Zusak', 'Drama', 'Intrínseca', 2005, '9780375842207', 'Português', 'Físico', 'capas/menina-roubava-livros.jpg', 'Durante a Segunda Guerra, uma menina encontra conforto nos livros.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:43'),
	(65, 'O Iluminado', 'Stephen King', 'Terror', 'Suma', 1977, '9780307743657', 'Português', 'Físico', 'capas/iluminado.jpg', 'Homem enlouquece em um hotel isolado.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:46'),
	(66, 'Drácula', 'Bram Stoker', 'Terror', 'DarkSide', 1897, '9780300105422', 'Português', 'E-book', 'capas/dracula.jpg', 'Vampiro ancestral espalha seu terror.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:49'),
	(67, 'It: A Coisa', 'Stephen King', 'Terror', 'Suma', 1986, '9781501142970', 'Português', 'Físico', 'capas/it.jpg', 'Ser maligno aterroriza uma cidade por décadas.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:53'),
	(68, 'O Exorcista', 'William Peter Blatty', 'Terror', 'HarperCollins', 1971, '9780061007224', 'Português', 'Físico', 'capas/exorcista.jpg', 'Menina possuída desafia padres e médicos.', 1, '2025-12-01 12:25:43', '2025-12-01 14:09:57'),
	(69, 'Coraline', 'Neil Gaiman', 'Terror', 'Rocco', 2002, '9780380807345', 'Português', 'E-book', 'capas/coraline.jpg', 'Garota encontra um mundo paralelo assustador.', 1, '2025-12-01 12:25:43', '2025-12-01 14:10:00'),
	(71, 'O Chamado de Cthulhu', 'H.P. Lovecraft', 'Horror Cósmico', 'Clock Tower', 1928, '9786053752391', 'Português', 'E-book', 'capas/cthulhu.jpg', 'Cultos misteriosos e um deus adormecido.', 1, '2025-12-01 12:25:43', '2025-12-01 14:10:05'),
	(72, 'Carrie', 'Stephen King', 'Terror', 'Suma', 1974, '9780345806816', 'Português', 'E-book', 'capas/carrie.jpg', 'Garota sofre bullying e libera um poder mortal.', 1, '2025-12-01 12:25:43', '2025-12-01 14:10:08'),
	(74, 'A Maldição da Casa da Colina', 'Shirley Jackson', 'Terror', 'Suma', 1959, '9780143122357', 'Português', 'Físico', 'capas/casa-colina.jpg', 'Casa assombrada com segredos mortais.', 1, '2025-12-01 12:25:43', '2025-12-01 14:10:11'),
	(75, 'Sherlock Holmes: Um Estudo em Vermelho', 'Arthur Conan Doyle', 'Suspense Policial', 'Zahar', 1887, '9780141034324', 'Português', 'Físico', 'capas/estudo-vermelho.jpg', 'Primeiro caso de Sherlock Holmes.', 1, '2025-12-01 12:25:43', '2025-12-01 14:10:17'),
	(76, 'O Silêncio dos Inocentes', 'Thomas Harris', 'Suspense Policial', 'Record', 1988, '9780312924584', 'Português', 'E-book', 'capas/silencio-inocentes.jpg', 'Agente FBI busca assassino com ajuda de Hannibal Lecter.', 1, '2025-12-01 12:25:43', '2025-12-01 14:10:25'),
	(77, 'Garota Exemplar', 'Gillian Flynn', 'Suspense', 'Intrínseca', 2012, '9780307588378', 'Português', 'Físico', 'capas/garota-exemplar.jpg', 'Mulher desaparece e marido se torna suspeito.', 1, '2025-12-01 12:25:43', '2025-12-01 14:10:32'),
	(78, 'O Colecionador', 'John Fowles', 'Suspense', 'Alfaguara', 1963, '9788498382899', 'Português', 'E-book', 'capas/colecionador.jpg', 'Homem sequestra mulher por obsessão.', 1, '2025-12-01 12:25:43', '2025-12-01 14:10:35'),
	(79, 'Os Homens que Não Amavam as Mulheres', 'Stieg Larsson', 'Suspense', 'Companhia das Letras', 2005, '9780307454543', 'Português', 'E-book', 'capas/livro1-millennium.jpg', 'Jornalista investiga desaparecimento misterioso.', 1, '2025-12-01 12:25:43', '2025-12-01 14:10:40'),
	(80, 'Boneco de Neve', 'Jo Nesbø', 'Suspense', 'Record', 2007, '9780349120536', 'Português', 'Físico', 'capas/boneco-neve.jpg', 'Detetive enfrenta assassino que deixa bonecos de neve.', 1, '2025-12-01 12:25:43', '2025-12-01 14:10:47'),
	(81, 'A Sangue Frio', 'Truman Capote', 'True Crime', 'Companhia das Letras', 1966, '9780679745587', 'Português', 'Físico', 'capas/sangue-frio.jpg', 'Matança brutal de uma família no Kansas.', 1, '2025-12-01 12:25:43', '2025-12-01 14:10:51'),
	(82, 'O Alienista', 'Machado de Assis', 'Satírico / Suspense', 'Antofágica', 1882, '9786587280039', 'Português', 'E-book', 'capas/alienista.jpg', 'Médico interna a cidade inteira como experimento.', 1, '2025-12-01 12:25:43', '2025-12-01 14:10:54'),
	(83, 'O Segredo dos Seus Olhos', 'Eduardo Sacheri', 'Suspense', 'Intrínseca', 2005, '9780307275056', 'Português', 'Físico', 'capas/segredo-olhos.jpg', 'Investigação de um crime não resolvido.', 1, '2025-12-01 12:25:43', '2025-12-01 14:10:57'),
	(84, 'Diário de um Banana', 'Jeff Kinney', 'Infantil', 'Vergara & Riba', 2007, '9780810993136', 'Português', 'Físico', 'capas/banana1.jpg', 'Diário engraçado sobre a vida escolar de Greg Heffley.', 1, '2025-12-01 12:25:43', '2025-12-01 14:11:04'),
	(85, 'A Fantástica Fábrica de Chocolate', 'Roald Dahl', 'Infantil', 'WMF Martins Fontes', 1964, '9780141365374', 'Português', 'E-book', 'capas/chocolate.jpg', 'Criança visita a fábrica mágica de Willy Wonka.', 1, '2025-12-01 12:25:43', '2025-12-01 14:11:09'),
	(86, 'Matilda', 'Roald Dahl', 'Infantil', 'WMF Martins Fontes', 1988, '9780142410370', 'Português', 'Físico', 'capas/matilda.jpg', 'Garota superdotada enfrenta pais e diretora cruel.', 1, '2025-12-01 12:25:43', '2025-12-01 14:11:12'),
	(88, 'Turma da Mônica – O Nascimento do Bidu', 'Mauricio de Sousa', 'Quadrinhos', 'Panini', 2015, '9788583680666', 'Português', 'E-book', 'capas/bidu.jpg', 'Origem de Bidu e Franjinha.', 1, '2025-12-01 12:25:43', '2025-12-01 14:11:16'),
	(89, 'O Gato de Botas', 'Charles Perrault', 'Conto Infantil', 'FDT', 1697, '9788532280122', 'Português', 'Físico', 'capas/gato-botas.jpg', 'Gato inteligente ajuda seu dono a se tornar rico.', 1, '2025-12-01 12:25:43', '2025-12-01 14:11:22'),
	(90, 'Pinóquio', 'Carlo Collodi', 'Infantil', 'Zahar', 1883, '9788537820484', 'Português', 'E-book', 'capas/pinoquio.jpg', 'Boneco que deseja virar um menino de verdade.', 1, '2025-12-01 12:25:43', '2025-12-01 14:11:30'),
	(91, 'A Bela e a Fera', 'Disney', 'Conto Infantil', 'Globo', 1991, '9788538058428', 'Português', 'Físico', 'capas/bela-e-fera.jpg', 'Fera amaldiçoada encontra redenção em um amor verdadeiro.', 1, '2025-12-01 12:25:43', '2025-12-01 14:11:34'),
	(92, 'O Patinho Feio', 'Hans Christian Andersen', 'Infantil', 'FDT', 1843, '9788532245848', 'Português', 'Físico', 'capas/patinho.jpg', 'Filhote rejeitado descobre sua verdadeira beleza.', 1, '2025-12-01 12:25:43', '2025-12-01 14:11:37'),
	(93, 'O Rei Leão', 'Disney', 'Infantil', 'Globo', 1994, '9788538058435', 'Português', 'E-book', 'capas/rei-leao.jpg', 'Simba precisa assumir seu lugar como rei.', 1, '2025-12-01 12:25:43', '2025-12-01 14:11:41'),
	(94, 'To Kill a Mockingbird', 'Harper Lee', 'Drama', 'J.B. Lippincott', 1960, '9780060935467', 'Inglês', 'Físico', 'capas/mockingbird.jpg', 'Clássico sobre racismo no sul dos EUA.', 1, '2025-12-01 12:25:43', '2025-12-01 14:11:45'),
	(95, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Romance', 'Scribner', 1925, '9780743273565', 'Inglês', 'Físico', 'capas/gatsby.jpg', 'A ascensão e tragédia de Jay Gatsby.', 1, '2025-12-01 12:25:43', '2025-12-01 14:11:54'),
	(96, 'Moby Dick', 'Herman Melville', 'Aventura', 'Penguin', 1851, '9780142437247', 'Inglês', 'E-book', 'capas/moby-dick.jpg', 'Capitão busca vingança contra uma baleia gigante.', 1, '2025-12-01 12:25:43', '2025-12-01 14:11:57'),
	(97, 'The Catcher in the Rye', 'J.D. Salinger', 'Drama', 'Little, Brown', 1951, '9780316769488', 'Inglês', 'Físico', 'capas/catcher.jpg', 'A rebeldia e solidão de Holden Caulfield.', 1, '2025-12-01 12:25:43', '2025-12-01 14:12:02'),
	(98, 'The Outsiders', 'S.E. Hinton', 'Drama', 'Puffin', 1967, '9780140385724', 'Inglês', 'Físico', 'capas/outsiders.jpg', 'Gangues adolescentes enfrentam desigualdade social.', 1, '2025-12-01 12:25:43', '2025-12-01 14:12:06'),
	(99, 'Dune', 'Frank Herbert', 'Ficção Científica', 'Ace Books', 1965, '9780441172719', 'Inglês', 'E-book', 'capas/dune.jpg', 'Jornada épica pela sobrevivência no planeta Arrakis.', 1, '2025-12-01 12:25:43', '2025-12-01 14:12:09'),
	(100, 'The Hunger Games', 'Suzanne Collins', 'Distopia', 'Scholastic', 2008, '9780439023528', 'Inglês', 'Físico', 'capas/hunger-games.jpg', 'Katniss luta por sobrevivência em um jogo mortal.', 1, '2025-12-01 12:25:43', '2025-12-01 14:12:11'),
	(101, 'The Fault in Our Stars', 'John Green', 'Romance', 'Penguin', 2012, '9780525478812', 'Inglês', 'E-book', 'capas/tfios.jpg', 'Dois jovens com câncer vivem um amor profundo.', 1, '2025-12-01 12:25:43', '2025-12-01 14:12:15'),
	(102, 'The Girl with the Dragon Tattoo', 'Stieg Larsson', 'Suspense', 'Knopf', 2005, '9780307269758', 'Inglês', 'Físico', 'capas/dragon-tattoo.jpg', 'Hacker e jornalista investigam mistérios sombrios.', 1, '2025-12-01 12:25:43', '2025-12-01 14:12:19'),
	(103, 'The Shining', 'Stephen King', 'Horror', 'Anchor', 1977, '9780307743654', 'Inglês', 'Físico', 'capas/shining.jpg', 'Homem enlouquece em hotel amaldiçoado.', 1, '2025-12-01 12:25:43', '2025-12-01 14:12:23');

-- Copiando estrutura para tabela dblivraria.reservas
CREATE TABLE IF NOT EXISTS `reservas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `livro_id` int(11) NOT NULL,
  `data_retirada` date NOT NULL,
  `data_devolucao` date NOT NULL,
  `confirmado_email` tinyint(1) DEFAULT 0,
  `criado_em` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `livro_id` (`livro_id`),
  CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela dblivraria.reservas: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela dblivraria.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `data_nascimento` date DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `curso` varchar(100) DEFAULT NULL,
  `perfil` enum('Aluno','Admin') DEFAULT 'Aluno',
  `codigo_verificacao` varchar(255) DEFAULT NULL,
  `verificado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela dblivraria.usuarios: ~8 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `data_nascimento`, `celular`, `curso`, `perfil`, `codigo_verificacao`, `verificado`) VALUES
	(1, 'Vitor Lima', 'vitor.lima@email.com', '1234', NULL, NULL, NULL, 'Admin', NULL, 0),
	(2, 'Pedro Campos', 'pedro.campos@email.com', 'abcd', NULL, NULL, NULL, 'Aluno', NULL, 0),
	(3, 'Pedro Gabriel', 'pedro.gabriel@email.com', 'senha123', NULL, NULL, NULL, 'Aluno', NULL, 0),
	(4, 'Davi Guedes', 'davi.guedes@email.com', 'teste123', NULL, NULL, NULL, 'Aluno', NULL, 0),
	(5, 'Matheus Lima', 'matheus.lima@email.com', '3210', NULL, NULL, NULL, 'Aluno', NULL, 0),
	(6, 'Lucas Ferreira', 'lucas.ferreira@email.com', 'senhaSegura123', NULL, NULL, NULL, 'Aluno', NULL, 0),
	(7, 'Matheuszin', 'Matheuszin@gmail.com', 'Matheuszinzinzin', NULL, NULL, NULL, 'Aluno', NULL, 0),
	(10, 'Lavíz', 'lavizsenai@gmail.com', '123', '2007-04-23', '11987654321', 'DS', 'Aluno', NULL, 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
