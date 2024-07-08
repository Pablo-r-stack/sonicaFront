import { preguntas } from "../data/preguntas.js";
import auth from "./modules/auth.js";

//VARIABLES
const cartaPregunta = document.querySelector(".contenedor-cartas-soporte");

//EVENTOS
document.addEventListener("DOMContentLoaded", ()=>{
  preguntas.forEach((preg)=>{
    cargarPreguntas(preg);
  })
  auth.updateNav();
})


function cargarPreguntas(pregunta) {
    const codigo = `
    <div class="carta-pregunta">
          <img id="icono" src="${pregunta.icono}" alt="icono" />
          <div class="imgpregunta">
            <h4>${pregunta.pregunta}</h4>
            <br>
            <div>
              <p>
              ${pregunta.respuesta}
              </p>
            </div>
          </div>
        </div>
 `
 cartaPregunta.innerHTML += codigo;
}