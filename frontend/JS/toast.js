if (!document.getElementById('toast-box')) {
    const box = document.createElement('div');
    box.id = 'toast-box';
    document.body.appendChild(box);
}
window.showToast = (msg, type = 'info') => {
    const div = document.createElement('div');
    div.className = 'toast';
    div.innerHTML = `<span>${msg}</span>`;
    if(type === 'success') div.style.borderColor = '#2ea043';
    if(type === 'error') div.style.borderColor = '#da3633';
    document.getElementById('toast-box').appendChild(div);
    setTimeout(() => div.remove(), 3000);
};