// No entiendo por qué pero tuve que usar getOrCreateInstance en vez de getInstance
const modal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#modal'))

// Preparar el formulario para agregar
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

// Preparar el formulario para actualizar
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

// Eliminar un sitio de los filtros
const eliminar_sitio = async (id) => {
    const data = await chrome.storage.sync.get('sitios')
    delete data.sitios[id]
    await chrome.storage.sync.set({
        sitios: data.sitios
    })
    cargar_sitios()
}

// Leer todos los sitios del almacenamiento
const sitios_contenedor = document.querySelector('#sitios')
const cargar_sitios = async () => {
    const data = await chrome.storage.sync.get('sitios')

    // Limpiar el contenedor
    sitios_contenedor.innerHTML = ''

    for (const filtro of Object.values(data.sitios)) {
        const tr = document.createElement('tr')
        tr.setAttribute('data-id', filtro.id)

        tr.innerHTML = `
            <td>${filtro.sitio}</td>
            <td></td>
            <td></td>
            <td></td>
        `

        // Agregar el checkbox
        tr.children[1].innerHTML = `
            <input type="checkbox" ${filtro.activo ? 'checked' : ''} disabled>
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
    let id = document.querySelector('#id')

    if (sitio.value) {
        if (id.value) {
            // Eliminar el sitio del almacenamiento
            const data = await chrome.storage.sync.get('sitios')
            delete data.sitios[id.value]
            await chrome.storage.sync.set({
                sitios: data.sitios
            })
        }

        // Generar el id
        id = await obtener_id()

        // Guardar en el almacenamiento
        const data = await chrome.storage.sync.get('sitios')
        data.sitios[id] = {
            id: id,
            sitio: sitio.value,
            activo: activo.checked
        }
        await chrome.storage.sync.set({
            sitios: data.sitios
        })

        // Recargar los sitios
        cargar_sitios()

        // Cerrar el modal
        modal.hide()
    }
})

// Obtener el id para cada filtro
async function obtener_id() {
    const data = await chrome.storage.sync.get('sitios')
    let mayor = 0
    for (const filtro of Object.values(data.sitios)) {
        if (filtro.id > mayor)
            mayor = filtro.id
    }
    return mayor + 1
}
