import auth from "./modules/auth.js";
import { conexionApi } from './modules/conexionApi.js';

const listaEventos = document.querySelector('.event-list ul');
const formModificar = document.querySelector('#modificarEventoForm');
const formEntradas = document.querySelector('#gestionEntradas');

document.addEventListener('DOMContentLoaded', async () => {
    if (!auth.checkAuth() || !auth.checkRol('Organizador')) {
        window.location.href = 'index.html';
    }
    await cargarDatos();
    initializeModal();
    initializeModalEntradas();
});

const cargarDatos = async () => {
    const eventos = await conexionApi.eventosOrganizador();
    console.log(eventos);
    if (eventos.length > 0) {
        eventos.forEach(evento => {
            const item = document.createElement('li');
            item.classList.add('event-item');
            item.setAttribute('data-id', evento.id);
            item.innerHTML = `
        <h2>${evento.titulo}</h2>
        <div class="botones-organizador">
        <button class="btn-contacto modificar-btn" value="${evento.id}">Modificar</button>
        <button class="btn-contacto" value="${evento.id}" data-entradas>Gestion Entradas</button>
        <button class="btn-contacto" value="${evento.id}" data-delete>Eliminar</button>
        </div>
        `;
            listaEventos.appendChild(item);
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
    } else {
        const div = document.createElement('div');
        div.innerHTML = `<h2>No hay eventos para mostrar</h2>`
    }
}

const initializeModal = () => {
    const modal = document.getElementById("modal");
    const closeModal = document.getElementsByClassName("close")[0];
    const modifyButtons = document.getElementsByClassName("modificar-btn");

    Array.from(modifyButtons).forEach(button => {
        button.addEventListener("click", async () => {
            const evento = await conexionApi.obtenerEventoId(button.value);
            const inputs = formModificar.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                const name = input.name;
                if (input.type === 'date' && evento[0][name]) {
                    input.value = new Date(evento[0][name]).toISOString().split('T')[0];
                } else if (input.type === 'time' && evento[0][name]) {
                    input.value = evento[0][name].slice(0, 5);
                } else {
                    input.value = evento[0][name];
                }
            });
            console.log(evento[0]);
            modal.style.display = "block";
        });
    });

    closeModal.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

formModificar.onsubmit = (async (e) => {
    e.preventDefault();

    const inputs = formModificar.querySelectorAll('input, textarea');

    const mensaje = {};

    inputs.forEach(input => {
        mensaje[input.id] = input.value.trim();
    })
    const id = mensaje.id;
    delete mensaje.id;
    const respuesta = await conexionApi.eventoModificar(mensaje, id);
    alert(respuesta.message);
    modal.style.display = "none";
    window.location.href = "organizador.html";
})


const initializeModalEntradas = () => {
    const modalEntradas = document.getElementById("modalEntradas");
    const closeModalEntradas = modalEntradas.getElementsByClassName("close")[0];
    const modifyEntradasButtons = document.querySelectorAll('[data-entradas]');

    Array.from(modifyEntradasButtons).forEach(button => {
        button.addEventListener("click", async () => {
            const entradas = await conexionApi.obtenerEntradas(button.value)
            const inputs = modalEntradas.querySelectorAll('input');
            inputs.forEach(input => {
                const name = input.name;
                if (entradas[name]) {
                    input.value = entradas[name];
                }
            });
            // Calcular el total recaudado
            const totalRecaudado = entradas.precio * entradas.vendidas;

            // Insertar los datos en la tabla
            const tableBody = modalEntradas.querySelector('tbody');
            tableBody.innerHTML = `
                  <tr>
                      <td>$${entradas.precio}</td>
                      <td>${entradas.disponibles}</td>
                      <td>${entradas.vendidas}</td>
                      <td>$${totalRecaudado}</td>
                  </tr>
              `;
            console.log(entradas);
            modalEntradas.style.display = "block";
        });
    });

    closeModalEntradas.onclick = function () {
        modalEntradas.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modalEntradas) {
            modalEntradas.style.display = "none";
        }
    }
}

gestionEntradas.onsubmit = (async (e) => {
    e.preventDefault();

    const inputs = formEntradas.querySelectorAll('input');

    const mensaje = {};
    inputs.forEach(input => {
        mensaje[input.id] = input.value.trim();
    })
    const id = mensaje.id;
    delete mensaje.id;
    const respuesta = await conexionApi.entradaModificar(mensaje, id);
    alert(respuesta.message);
    modalEntradas.style.display = "none";
})

