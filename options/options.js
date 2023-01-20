// No entiendo por qué pero tuve que usar getOrCreateInstance en vez de getInstance
const modal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#modal'))

document.querySelector('#agregar').addEventListener('click', () => {
    document.querySelector('#modal-title').textContent = 'Agregar sitio'
    modal.show()
})

const sitios = document.querySelector('#sitios')

// Guardar, ya sea crear o actualizar
document.querySelector('#guardar').addEventListener('click', () => {
    const sitio = document.querySelector('#sitio')
    const activo = document.querySelector('#activo')

    // Determinar si es crear o actualizar
    const id = document.querySelector('#id')

    if (sitio.value) {
        if (id.value) { } else {
            // Crear una fila
            const tr = document.createElement('tr')

            // Agregar el sitio
            tr.innerHTML = `
                <td>${sitio.value}</td>
                <td></td>
                <td></td>
                <td></td>
            `

            // Agregar el checkbox
            tr.children[1].innerHTML = `
                <input type="checkbox" ${activo.checked ? 'checked' : ''} disabled>
            `

            // Agregar botón de actualizar
            const actualizar = document.createElement('button')
            actualizar.classList.add('btn', 'btn-primary', 'btn-sm')
            actualizar.textContent = 'Actualizar'
            actualizar.addEventListener('click', actualizar_sitio)
            tr.children[2].appendChild(actualizar)

            // Agregar botón de eliminar
            const eliminar = document.createElement('button')
            eliminar.classList.add('btn', 'btn-danger', 'btn-sm')
            eliminar.textContent = 'Eliminar'
            eliminar.addEventListener('click', eliminar_sitio)
            tr.children[3].appendChild(eliminar)

            // Agregar la fila
            sitios.appendChild(tr)

            // Limpiar el formulario
            sitio.value = ''
            activo.checked = true
            modal.hide()
        }
    }
})

// Actualizar
function actualizar_sitio() {
    console.log('Actualizar sitio')
}

// Eliminar
function eliminar_sitio() {
    console.log('Eliminar sitio')
}