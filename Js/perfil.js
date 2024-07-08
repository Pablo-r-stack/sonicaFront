import auth from "./modules/auth.js";
import { conexionApi } from "./modules/conexionApi.js";

// Función para capitalizar la primera letra
function capitalizarPrimeraLetra(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const perfil = document.querySelector('.section-perfil');
const section = document.querySelector('section');

// Carga de contenido
document.addEventListener('DOMContentLoaded', () => {
    if (!auth.checkAuth()) window.location.href = 'index.html';
    auth.updateNav();
    cargaDatosUsuario();
});

const cargaDatosUsuario = async () => {
    const usuario = await conexionApi.obtenerDatosUsuarios();
    usuario.nombre = capitalizarPrimeraLetra(usuario.nombre);
    usuario.apellido = capitalizarPrimeraLetra(usuario.apellido);

    const div = document.createElement('div');
    const h1 = document.createElement('h1');
    section.insertBefore(h1, perfil);
    h1.innerHTML = `<h1 class="huno">Bienvenido: <span id="user-name">${usuario.nombre} ${usuario.apellido}</span></h1>`;
    div.innerHTML = `
        <div class="perfil-contenido">
            <div class="datos-perfil">
                <h2>TUS DATOS</h2>
                <p>Nombre: <span id="user-nombre">${usuario.nombre}</span></p>
                <p>Email: <span id="user-email">${usuario.email}</span></p>
                <p>País: <span id="user-pais">${usuario.pais}</span></p>
                <p>DNI: <span id="user-dni">${usuario.dni}</span></p>
                <p>TIPO DE CUENTA: <span id="user-rol">${usuario.rol}</span></p>
            </div>
        </div>
    `;
    perfil.insertBefore(div, perfil.firstChild);

    datosEditForm(usuario);
};

// Get modal elements
const editDataModal = document.getElementById('edit-data-modal');
const changePasswordModal = document.getElementById('change-password-modal');

// Get open modal buttons
const editDataBtn = document.getElementById('edit-data-btn');
const changePasswordBtn = document.getElementById('change-password-btn');

// Get close buttons
const closeEditDataModal = document.getElementById('close-edit-data-modal');
const closeChangePasswordModal = document.getElementById('close-change-password-modal');

// Open modals
editDataBtn.onclick = function () {
    editDataModal.style.display = 'block';
};
changePasswordBtn.onclick = function () {
    changePasswordModal.style.display = 'block';
};

// Close modals
closeEditDataModal.onclick = function () {
    editDataModal.style.display = 'none';
};
closeChangePasswordModal.onclick = function () {
    changePasswordModal.style.display = 'none';
};

// Close modals when clicking outside the modal content
window.onclick = function (event) {
    if (event.target === editDataModal) {
        editDataModal.style.display = 'none';
    }
    if (event.target === changePasswordModal) {
        changePasswordModal.style.display = 'none';
    }
};

// Form submission (placeholder logic)
const editDataForm = document.getElementById('edit-data-form');
const changePasswordForm = document.getElementById('change-password-form');

const datosEditForm = (usuario) => {
    const inputs = editDataForm.querySelectorAll('input');
    inputs.forEach(input => {
        const name = input.name;
        if (usuario[name]) {
            input.value = usuario[name];
        }
    });
};

editDataForm.onsubmit = async function (event) {
    event.preventDefault(); // Prevent form submission for demo purposes
    const inputs = editDataForm.querySelectorAll('input');
    const mensaje = {};
    inputs.forEach((input) => {
        mensaje[input.name] = input.value.trim();
    });
    const id = mensaje.id;
    delete mensaje.id;
    const respuesta = await conexionApi.modificarDatosUsuario(mensaje, id);
    console.log(respuesta);
    editDataModal.style.display = 'none'; // Close modal after submission
};

changePasswordForm.onsubmit = async function (event) {
    event.preventDefault(); // Prevent form submission for demo purposes
    const inputs = changePasswordForm.querySelectorAll('input');
    const inputId = document.querySelector('#id');
    const mensaje = {};
    mensaje[inputId.name] = inputId.value.trim();
    inputs.forEach((input) => {
        mensaje[input.name] = input.value.trim();
    });
    if (mensaje.password !== mensaje.password2) {
        console.log('Las contraseñas no coinciden');
    } else {
        delete mensaje.password2;
        const respuesta = await conexionApi.modificarPassword(mensaje);
        console.log(respuesta);
    }
    inputs.forEach(input => input.value = '');
    changePasswordModal.style.display = 'none'; // Close modal after submission
};

