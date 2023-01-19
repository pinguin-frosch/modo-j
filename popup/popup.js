const modo = document.querySelector('#modo')
const texto_modo = document.querySelector('#texto_modo')

modo.addEventListener('input', (e) => {
    texto_modo.innerHTML = e.target.checked ? 'Modo J' : 'Modo P'
})
