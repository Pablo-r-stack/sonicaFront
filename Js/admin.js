import auth from "./modules/auth.js"
import { apiUrl, conexionApi } from "./modules/conexionApi.js";

const usuariosBtn = document.querySelector('[data-usuarioBtn]');
const eventosBtn = document.querySelector('[data-eventosBtn]');

document.addEventListener('DOMContentLoaded', () => {
    if (!auth.checkAuth() || !auth.checkRol('Administrador')) {
        window.location.href = 'index.html';
    }
});

usuariosBtn.addEventListener('click', async () => {
    const usuarios = await conexionApi.listarUsuarios();
    console.log(usuarios);
    if (usuarios.length > 0) {
        const listaUsuarios = document.querySelector('.lista-usuarios');
        listaUsuarios.innerHTML = '<h1 class="titulo-listaUsuarios">LISTA DE USUARIOS</h1>'; // Limpiar la lista antes de agregar nuevos elementos
        usuarios.forEach(usuario => {
            const row = document.createElement('ul');
            row.classList.add('user-list');
            row.innerHTML = `
            <div class="texto" data-id=${usuario.id}>
                <li>${usuario.id}</li>
                <li><strong>Nombre:</strong> ${usuario.nombre}</li>
                <li><strong>Apellido:</strong> ${usuario.apellido}</li>
                <li><strong>Email:</strong> ${usuario.email}</li>
                <li><strong>País:</strong> ${usuario.pais}</li>
                <li><strong>DNI:</strong> ${usuario.dni}</li>
                <li><strong>Rol:</strong>
                    <span class="user-role">${usuario.rol}</span>
                    <select class="rolSelect" style="display: none;">
                        <option value="Cliente" ${usuario.rol === 'Cliente' ? 'selected' : ''}>Cliente</option>
                        <option value="Organizador" ${usuario.rol === 'Organizador' ? 'selected' : ''}>Organizador</option>
                        <option value="Administrador" ${usuario.rol === 'Administrador' ? 'selected' : ''}>Administrador</option>
                    </select>
                </li>
            </div>
            <div class="action-buttons">
                <button class="btn-contacto edit-btn">Editar</button>
                <button class="btn-contacto" value="${usuario.id}">Eliminar</button>
                <button class="btn-contacto save-btn" value="${usuario.id}" style="display: none;">Guardar</button>
            </div>
            `;
            listaUsuarios.appendChild(row);

            // Obtener referencias a los elementos de acción
            const editBtn = row.querySelector('.edit-btn');
            const saveBtn = row.querySelector('.save-btn');
            const select = row.querySelector('.rolSelect');
            const roleText = row.querySelector('.user-role');
            const deleteBtn = row.querySelector('.action-buttons button:nth-child(2)');

            // Asignar evento al botón "Editar"
            editBtn.addEventListener('click', () => {
                select.style.display = 'inline-block'; // Mostrar el select
                roleText.style.display = 'none'; // Ocultar el texto del rol

                editBtn.style.display = 'none'; // Ocultar el botón de editar
                saveBtn.style.display = 'inline-block'; // Mostrar el botón de guardar
                deleteBtn.style.display = 'none'; // Ocultar el botón de eliminar
            });

            // Asignar evento al botón "Guardar"
            saveBtn.addEventListener('click', async() => {
                roleText.innerText = select.options[select.selectedIndex].text; // Actualizar el texto del rol
                select.style.display = 'none'; // Ocultar el select
                roleText.style.display = 'inline-block'; // Mostrar el texto del rol

                editBtn.style.display = 'inline-block'; // Mostrar el botón de editar
                saveBtn.style.display = 'none'; // Ocultar el botón de guardar
                deleteBtn.style.display = 'inline-block'; // Mostrar el botón de eliminar

                // Aquí puedes añadir la lógica para guardar el nuevo rol en tu backend
                const userId = saveBtn.value;
                const parametros = {rol: select.value, id: userId};
                const respuesta = await conexionApi.adminModificarRol(parametros);
                console.log(respuesta);
                console.log(`Guardar cambios para el usuario con ID: ${userId} y nuevo rol: ${select.value}`);
            });

            //borrar usuario
            deleteBtn.addEventListener('click', async () => {
                console.log('Intentando borrar usuario id ' + deleteBtn.value);
                const respuesta = await conexionApi.adminEliminarUsuario(deleteBtn.value);
                console.log(respuesta);

                // Seleccionar el elemento correcto y eliminarlo
                const usuarioElement = row.querySelector(`.texto[data-id="${deleteBtn.value}"]`).parentElement;
                if (usuarioElement) {
                    usuarioElement.remove();
                }
            });
        });
    }
    showUsuarios();
});

eventosBtn.addEventListener('click', async () => {
    const response = await fetch(`${apiUrl}/evento/lista`);
    const eventos = await response.json();
    console.log(eventos);

    if (eventos.length > 0) {
        const listaEventos = document.querySelector('.event-list2 ul');
        listaEventos.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos

        eventos.forEach(evento => {
            const itemLista = document.createElement('li');
            itemLista.classList.add('event-item2');
            itemLista.setAttribute('data-id', evento.id); // Agregar data-id al li
            itemLista.innerHTML = `
                <span>${evento.titulo}</span>
                <button class="btn-contacto" value="${evento.id}" data-delete>Eliminar</button>
            `;
            listaEventos.appendChild(itemLista);
        });

        const deleteEvento = document.querySelectorAll('[data-delete]');
        deleteEvento.forEach(boton => {
            boton.addEventListener('click', async () => {
                const respuesta = await conexionApi.borrarEvento(boton.value);
                console.log(respuesta);

                if (respuesta) { // Suponiendo que la respuesta indica el éxito de la eliminación
                    const eventoElement = document.querySelector(`li[data-id="${boton.value}"]`);
                    if (eventoElement) {
                        eventoElement.remove();
                    }
                } else {
                    console.error('Error al borrar el evento');
                }
            });
        });
    }
    showEventos();
});

function showUsuarios() {
    document.querySelector('.lista-usuarios').style.display = 'block';
    document.querySelector('.lista-eventos').style.display = 'none';
}

function showEventos() {
    document.querySelector('.lista-usuarios').style.display = 'none';
    document.querySelector('.lista-eventos').style.display = 'block';
}