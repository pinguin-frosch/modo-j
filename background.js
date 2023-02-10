// Iniciar el estado en apagado
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['activo', 'sitios'], (data) => {
        if (data.activo === undefined) chrome.storage.sync.set({ 'activo': true })
        if (data.sitios === undefined) chrome.storage.sync.set({ 'sitios': {} })
    })
})

// Variables globales
let sitios = []; let activo = true

// Leer los valores desde el almacenamiento
chrome.storage.sync.get(['sitios', 'activo'], (data) => {
    sitios = Object.values(data.sitios || {}).filter(sitio => sitio.activo).map(sitio => sitio.sitio)
    activo = data.activo === undefined ? true : data.activo
    cambiar_icono(activo)
})

// Actualizar los valores cuando cambien
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        if (changes.sitios)
            sitios = Object.values(changes.sitios.newValue).filter(sitio => sitio.activo).map(sitio => sitio.sitio)
        if (changes.activo) {
            activo = changes.activo.newValue
            cambiar_icono(activo)
        }
    }
})

// Bloquear páginas según preferencias
const bloquear_sitio = (tabId, _, tab) => {
    if (activo) {
        for (let sitio of sitios) {
            // Reemplazar ? y .
            sitio = sitio.replace(/\?/g, '\\?').replace(/\./g, '\\.')
            const regex = new RegExp(`^https?:\/\/([a-zA-Z0-9]*\.)?${sitio}\/?.*$`)

            if (regex.test(tab.url) || regex.test(tab.pendingUrl))
                chrome.tabs.update(tabId, { url: 'chrome://newtab' })
        }
    }
}

// Estar pendiente de cada pestaña
chrome.tabs.onUpdated.addListener(bloquear_sitio)

// Cambiar el icono según el estado
const cambiar_icono = (activo) => {
    chrome.action.setIcon({
        path: {
            '16': `images/icon-${activo ? 'j' : 'p'}-16.png`,
            '32': `images/icon-${activo ? 'j' : 'p'}-32.png`,
            '48': `images/icon-${activo ? 'j' : 'p'}-48.png`,
            '64': `images/icon-${activo ? 'j' : 'p'}-64.png`,
            '128': `images/icon-${activo ? 'j' : 'p'}-128.png`,
            '256': `images/icon-${activo ? 'j' : 'p'}-256.png`
        }
    })
}
