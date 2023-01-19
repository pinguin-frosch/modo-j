// Iniciar el estado en apagado
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        'activo': false
    })
})
