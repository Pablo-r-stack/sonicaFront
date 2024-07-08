import auth from "./modules/auth.js";
import { conexionApi } from "./modules/conexionApi.js";

const formulario = document.querySelector('[data-formEvento]');


document.addEventListener('DOMContentLoaded', ()=>{
    if (!auth.checkAuth() || !auth.checkRol('Organizador')) {
        window.location.href = 'index.html';
    }
})

formulario.onsubmit = (async(e)=>{
    e.preventDefault();
    const inputs = formulario.querySelectorAll('input, textarea');
    const mensaje = {}
    inputs.forEach(input=>{
        mensaje[input.id] = input.value.trim();
    })
    const respuesta = await conexionApi.eventoCrear(mensaje);
    console.log(respuesta);
    alert(respuesta.message);
    window.location.href = 'organizador.html';
});