// No entiendo por qué pero tuve que usar getOrCreateInstance en vez de getInstance
const modal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#modal'))

// Agregar
document.querySelector('#agregar').addEventListener('click', () => {
    document.querySelector('#modal-title').textContent = 'Agregar sitio'

    // Limpiar el formulario
    document.querySelector('#id').value = ''
    document.querySelector('#sitio').value = ''
    document.querySelector('#activo').checked = true

    // Mostrar el modal
    modal.show()

    // Fijar el foco
    document.querySelector('#sitio').focus()
})

// Actualizar
const actualizar_sitio = (id) => {
    document.querySelector('#modal-title').textContent = 'Actualizar sitio'

    // Cambiar los valores del formulario
    document.querySelector('#id').value = id
    document.querySelector('#sitio').value = document.querySelector(`[data-id="${id}"] td`).textContent
    document.querySelector('#activo').checked = document.querySelector(`[data-id="${id}"] input`).checked

    // Mostrar el modal
    modal.show()

    // Fijar el foco
    document.querySelector('#sitio').focus()
}

// Eliminar
const eliminar_sitio = async (id) => {
    await chrome.declarativeNetRequest.updateDynamicRules({
        'removeRuleIds': [id]
    })
    cargar_sitios()
}

// Leer
const sitios_contenedor = document.querySelector('#sitios')
const cargar_sitios = async () => {
    const filtros = await chrome.declarativeNetRequest.getDynamicRules()

    // Limpiar el contenedor
    sitios_contenedor.innerHTML = ''

    for (const filtro of filtros) {
        const tr = document.createElement('tr')
        tr.setAttribute('data-id', filtro.id)

        tr.innerHTML = `
            <td>${filtro.condition.urlFilter}</td>
            <td></td>
            <td></td>
            <td></td>
        `

        // Agregar el checkbox
        tr.children[1].innerHTML = `
            <input type="checkbox" ${filtro.action.type === 'block' ? 'checked' : ''} disabled>
        `

        // Botón actualizar
        const actualizar = document.createElement('button')
        actualizar.classList.add('btn', 'btn-primary', 'btn-sm')
        actualizar.textContent = 'Actualizar'
        actualizar.addEventListener('click', () => { actualizar_sitio(filtro.id) })
        tr.children[2].appendChild(actualizar)

        // Botón eliminar
        const eliminar = document.createElement('button')
        eliminar.classList.add('btn', 'btn-danger', 'btn-sm')
        eliminar.textContent = 'Eliminar'
        eliminar.addEventListener('click', () => { eliminar_sitio(filtro.id) })
        tr.children[3].appendChild(eliminar)

        // Agregar el tr al tbody
        sitios_contenedor.appendChild(tr)
    }
}
cargar_sitios()

// Guardar, ya sea crear o actualizar
document.querySelector('#guardar').addEventListener('click', async () => {
    const sitio = document.querySelector('#sitio')
    const activo = document.querySelector('#activo')

    // Determinar si es crear o actualizar
    const id = document.querySelector('#id')

    if (sitio.value) {
        if (id.value) {
            // Eliminar el filtro anterior
            await chrome.declarativeNetRequest.updateDynamicRules({
                'removeRuleIds': [parseInt(id.value)]
            })
        }
        // Agregar el filtro
        await chrome.declarativeNetRequest.updateDynamicRules({
            'addRules': [{
                'id': await obtener_id(),
                'priority': 1,
                'action': {
                    'type': activo.checked ? 'block' : 'allow'
                },
                'condition': {
                    'urlFilter': sitio.value,
                    'resourceTypes': ['main_frame']
                }
            }]
        })
        // Recargar los sitios
        cargar_sitios()

        // Cerrar el modal
        modal.hide()
    }
})

// Obtener el id para cada filtro
async function obtener_id() {
    const filtros = await chrome.declarativeNetRequest.getDynamicRules()
    let mayor = 0
    for (const filtro of filtros) {
        if (filtro.id > mayor)
            mayor = filtro.id
    }
    return mayor + 1
}
