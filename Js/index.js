// VARIABLES

import { apiUrl, conexionApi } from "./modules/conexionApi.js";

// Vincular elementos necesarios al DOM
const contenedorCartas = document.querySelector('.contenedor-cartas');

// Clonar nodo del template
const templateCarta = document.querySelector('#template-carta').content;

// EVENTOS
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const datos = await pedirDatos();
        if (datos && datos.length > 0) {
            datos.forEach(show => {
                const nuevaCarta = crearCartaBanda(show.id, show.titulo, show.fecha, show.lugar, show.hora, show.direccion, show.coordenadas, show.imagen, show.descripcion);
                contenedorCartas.appendChild(nuevaCarta);
            });
        } else {
            contenedorCartas.innerHTML += `<h2>Aún no hay shows disponibles</h2>`;
        }
    } catch (error) {
        contenedorCartas.innerHTML += `<h2>Ocurrió un error, estamos trabajando para resolverlo</h2>`;
    }
});

// FUNCIONES

// Función para pedir datos
async function pedirDatos() {
    // let respuesta = await fetch("./data/bandas.json");
    // let datos = await respuesta.json();
    const datos = await conexionApi.consultarApi(`${apiUrl}/evento/lista`);
    return datos;
}

// Función para crear el div de la carta de la banda
function crearCartaBanda(id, titulo, fecha, lugar, hora, direccion, coordenadas, imagenSrc, descripcion) {
    const soloFecha = fecha.split('T')[0];
    const nuevaCarta = templateCarta.cloneNode(true);
    nuevaCarta.querySelector('[data-id]').setAttribute('data-id', id);
    nuevaCarta.querySelector('img').src = imagenSrc;
    nuevaCarta.querySelector('.texto-carta p:nth-child(1)').textContent = titulo;
    nuevaCarta.querySelector('.texto-carta p:nth-child(2)').textContent = soloFecha;
    nuevaCarta.querySelector('.texto-carta p:nth-child(3)').textContent = lugar;

    nuevaCarta.querySelector('.carta').addEventListener('click', () => {
        localStorage.setItem('selectedShow', JSON.stringify({id, titulo, fecha, lugar, hora, direccion, coordenadas, imagenSrc, descripcion }));
        window.location.href = '/evento.html';
    });

    return nuevaCarta;
}
