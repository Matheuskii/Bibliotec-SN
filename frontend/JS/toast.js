function garantirContainerToast() {
    if (!document.getElementById('toast-box')) {
        const box = document.createElement('div');
        box.id = 'toast-box';
        document.body.appendChild(box);
    }
}

window.showToast = function(msg, type = 'info') {
    garantirContainerToast();

    const div = document.createElement('div');
    div.className = 'toast';
    div.innerHTML = `<span>${msg}</span>`;
    
    // Cores baseadas no tipo
    if(type === 'success') div.style.borderLeftColor = '#2ea043'; // Verde
    if(type === 'error') div.style.borderLeftColor = '#da3633';   // Vermelho
    if(type === 'info') div.style.borderLeftColor = '#2f86eb';    // Azul

    const box = document.getElementById('toast-box');
    box.appendChild(div);

    setTimeout(() => {
        div.style.animation = 'sair 0.5s forwards'; // Opcional: animação de saída
        setTimeout(() => div.remove(), 500);
    }, 3000);
};