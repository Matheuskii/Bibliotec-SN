import { criarCardLivroClicavel } from "./Estrutura.js";
import API_BASE_URL from "./config.js";

const API = `${API_BASE_URL}/livros`;

document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('todos-livros');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // 1. Carrega os livros
    const livros = await carregarLivros();

    // 2. Renderiza todos inicialmente
    renderizarLivros(livros, grid);

    // 3. Configura os botões de filtro
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove 'active' de todos e adiciona no clicado
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            filtrarLivros(filter, livros, grid);
        });
    });
});

// --- FUNÇÃO DE FILTRAGEM MELHORADA ---
function filtrarLivros(filtro, livrosCompletos, gridElement) {
    let livrosFiltrados = livrosCompletos;

    const limpar = (texto) => {
        return texto ? texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
    };

    if (filtro !== 'todos') {
        livrosFiltrados = livrosCompletos.filter(livro => {
            const genero = limpar(livro.genero);
            const formato = limpar(livro.formato);

            if (filtro === 'ebook') return formato === 'e-book';
            if (filtro === 'audiolivro') return formato === 'audiobook';
            if (filtro === 'genero-romance') return genero.includes('romance');
            if (filtro === 'genero-ficcao') return genero.includes('ficcao') || genero.includes('cientifica');
            if (filtro === 'genero-humor') return genero.includes('humor') || genero.includes('comedia') || genero.includes('satira');
            return true;
        });
    }

    renderizarLivros(livrosFiltrados, gridElement);
}

// --- FUNÇÃO DE RENDERIZAÇÃO ---
function renderizarLivros(livros, gridElement) {
    gridElement.innerHTML = '';

    if (!livros || livros.length === 0) {
        gridElement.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">NENHUM livro encontrado nesta categoria 😢</p>';
        return;
    }

    livros.forEach(livro => {
        const card = criarCardLivroClicavel(livro);
        gridElement.appendChild(card);
    });
}

// --- BUSCA NA API ---
async function carregarLivros() {
    try {
        const resposta = await fetch(API);
        const livros = await resposta.json();
        return livros;
    } catch (erro) {
        console.error('Erro ao carregar livros:', erro);
        return [];
    }
}
