async function carregarFavoritos() {
    try {
        const usuarioId = localStorage.getItem('usuarioId');
        if (!usuarioId || usuarioId === null) {
            alert('Você precisa estar logado para ver seus favoritos.');
            return;
        }
        const resposta = await fetch (`http://localhost:3000/favoritos/${usuarioId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!resposta.ok) {
            throw new Error('Erro ao carregar favoritos');
        }
        const favoritos = await resposta.json();
        console.log(favoritos);
         }
        catch (erro) {
        console.error('Erro ao carregar favoritos:', erro);
        alert('Não foi possível carregar os favoritos. Tente novamente mais tarde.');
        }
}
carregarFavoritos();