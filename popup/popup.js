const activo = document.querySelector('#activo')
const texto = document.querySelector('#texto')

// Abrir la página de opciones
document.querySelector('#opciones').addEventListener('click', () => {
    chrome.runtime.openOptionsPage()
})

// Leer al iniciar la extensión
chrome.storage.sync.get('activo', (data) => {
    activo.checked = data.activo
    change_text(data.activo)
})

// Cambiar el estado al hacer click
activo.addEventListener('input', (e) => {
    change_text(e.target.checked)
    chrome.storage.sync.set({
        'activo': e.target.checked
    })
})

// Cambiar el texto
function change_text(activo) {
    texto.innerHTML = activo ? 'Modo J' : 'Modo P'
}
