// Iniciar el estado en apagado
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        'activo': false,
        'sitios': []
    })
})

// Valores por defecto
let sitios = []
let activo = false

// Leer los sitios
chrome.storage.sync.get('sitios', (data) => {
    sitios = data.sitios
})

// Leer el estado
chrome.storage.sync.get('activo', (data) => {
    activo = data.activo
})

// Actualizar los valores cuando cambien
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        if (changes.sitios) {
            sitios = changes.sitios.newValue
        }
        if (changes.activo) {
            activo = changes.activo.newValue
        }
    }
    console.log('sitios:', sitios)
    console.log('activo:', activo)
})
