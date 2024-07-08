import { colaborador } from "../data/colaborador.js";
import auth from "./modules/auth.js";

//VARIABLES
const contenedor = document.querySelector(".container__cards");
//EVENTOS
document.addEventListener('DOMContentLoaded', function () {
    cargarTarjeta(colaborador);
    auth.updateNav();
})



function cargarTarjeta(nosotros) {
    let codigo = "";
    if (nosotros.length > 0) {
        nosotros.forEach(function (item) {
            codigo += `
            <div class="card">
                    <div class="cover">
                        <img src="${item.imagecara}" alt="">
                        <div class="img__back"></div>
                    </div>
                    <div class="description">
                        <h2>${item.nom}</h2>
                        <p>${item.roll}</p>
                        <div>
                        <a href="${item.linked}"><img class="iconolinkedin" src="img/icons/LinkedInIcon.png" alt="linkedin"></a>
                        <a href="${item.github}"><img class="iconogithub" src="img/icons/github.png" alt="github"></a>
                        </div>
                    </div>
                </div> 
        `;
        });
    }else{
        codigo = `
        <h2>No se encontraron datos, vuelve a intentarlo mas tarde</h2>
        `;
    }
    contenedor.innerHTML += codigo;
}



