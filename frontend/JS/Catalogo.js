const API = 'http://localhost:3000/livros';
document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('todos-livros');
  const filterBtns = document.querySelectorAll('.filter-btn');

  const livros = await carregarLivros();

  if (!livros.length) {
    grid.innerHTML = '<p>Nenhum livro disponível</p>';
    return;
  }

  renderizarLivros(livros);

  const bookCards = document.querySelectorAll('.book-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      filtrarLivros(filter, livros);
    });
  });

  function filtrarLivros(filtro, livrosCompletos) {
    grid.innerHTML = '';

    let livrosFiltrados = livrosCompletos;

    if (filtro === 'ebook') {
      livrosFiltrados = livrosCompletos.filter(l => l.formato === 'E-book');
    } else if (filtro === 'audiolivro') {
      livrosFiltrados = livrosCompletos.filter(l => l.formato === 'Audiobook');
    } else if (filtro === 'genero-romance') {
      livrosFiltrados = livrosCompletos.filter(l => l.genero?.toLowerCase().includes('romance'));
    } else if (filtro === 'genero-ficcao') {
      livrosFiltrados = livrosCompletos.filter(l => l.genero?.toLowerCase().includes('ficção') || l.genero?.toLowerCase().includes('ficcao'));
    } else if (filtro === 'genero-humor') {
      livrosFiltrados = livrosCompletos.filter(l => l.genero?.toLowerCase().includes('humor'));
    }

    renderizarLivros(livrosFiltrados);
  }
});

function renderizarLivros(livros) {
  const grid = document.getElementById('todos-livros');
  grid.innerHTML = '';

  if (!livros.length) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Nenhum livro encontrado nesta categoria</p>';
    return;
  }

  livros.forEach(livro => {
    const card = document.createElement('div');
    card.className = 'book-card';

    card.innerHTML = `
      <div class="book-cover">
        <img src="${livro.caminho_capa}" alt="${livro.titulo}">
      </div>
      <div class="book-info">
        <div class="book-title">${livro.titulo}</div>
        <div class="book-author">${livro.autor || 'Autor desconhecido'}</div>
        <div class="book-category">${livro.genero || 'Sem gênero'}</div>
        <div class="book-format">${livro.formato || 'Formato desconhecido'}</div>
      </div>
    `;

    grid.appendChild(card);
  });
}

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
