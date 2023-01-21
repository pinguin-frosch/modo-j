// No entiendo por qué pero tuve que usar getOrCreateInstance en vez de getInstance
const modal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#modal'))

// Agregar
document.querySelector('#agregar').addEventListener('click', () => {
    document.querySelector('#modal-title').textContent = 'Agregar sitio'

    // Limpiar el formulario
    document.querySelector('#id').value = ''
    document.querySelector('#sitio').value = ''
    document.querySelector('#activo').checked = true

    modal.show()
})

// Actualizar
const actualizar_sitio = (id) => {
    document.querySelector('#modal-title').textContent = 'Actualizar sitio'

    // Cambiar los valores del formulario
    document.querySelector('#id').value = id
    document.querySelector('#sitio').value = document.querySelector(`[data-id="${id}"] td`).textContent
    document.querySelector('#activo').checked = document.querySelector(`[data-id="${id}"] input`).checked

    modal.show()
}

// Eliminar
const eliminar_sitio = async (id) => {
    const data = await chrome.storage.sync.get('sitios')
    data.sitios.splice(id, 1)
    await chrome.storage.sync.set(data)
    cargar_sitios()
}

// Leer
const sitios_contenedor = document.querySelector('#sitios')
const cargar_sitios = async () => {
    // Obtener los sitios
    const data = await chrome.storage.sync.get('sitios')

    // Limpiar el contenedor
    sitios_contenedor.innerHTML = ''

    // Agregar los sitios
    for (const [index, sitio] of data.sitios.entries()) {

        // Crear una fila
        const tr = document.createElement('tr')
        tr.dataset.id = index

        // Agregar el sitio
        tr.innerHTML = `
            <td>${sitio.sitio}</td>
            <td></td>
            <td></td>
            <td></td>
        `

        // Agregar el checkbox
        tr.children[1].innerHTML = `
            <input type="checkbox" ${sitio.activo ? 'checked' : ''} disabled>
        `

        // Agregar botón de actualizar
        const actualizar = document.createElement('button')
        actualizar.classList.add('btn', 'btn-primary', 'btn-sm')
        actualizar.textContent = 'Actualizar'
        actualizar.addEventListener('click', () => { actualizar_sitio(index) })
        tr.children[2].appendChild(actualizar)

        // Agregar botón de eliminar
        const eliminar = document.createElement('button')
        eliminar.classList.add('btn', 'btn-danger', 'btn-sm')
        eliminar.textContent = 'Eliminar'
        eliminar.addEventListener('click', () => { eliminar_sitio(index) })
        tr.children[3].appendChild(eliminar)

        // Agregar la fila
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
            // Guardar en el almacenamiento
            const data = await chrome.storage.sync.get('sitios')
            data.sitios[id.value] = {
                'sitio': sitio.value,
                'activo': activo.checked
            }
            await chrome.storage.sync.set(data)
        } else {
            // Guardar en el almacenamiento
            const data = await chrome.storage.sync.get('sitios')
            data.sitios.push({
                'sitio': sitio.value,
                'activo': activo.checked
            })
            await chrome.storage.sync.set(data)
        }
        // Recargar los sitios
        cargar_sitios()

        // Cerrar el modal
        modal.hide()
    }
})
