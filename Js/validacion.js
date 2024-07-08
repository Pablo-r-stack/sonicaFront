import { conexionApi } from "./modules/conexionApi.js";

const formulario = document.querySelector('form');
const campos = formulario.querySelectorAll('input, textarea, select');
const msgValidacion = document.querySelector('#mensajeValidacion')
const terminos = formulario.querySelector('#tyc');
//eventos
campos.forEach((campo) => {
    campo.addEventListener('keydown', (e) => {
        borrarMensaje(campo);
        if (campo.type === 'email' || campo.type === 'password') {
            const caracteresProhibidos = /[#!=:& /()[\]]/;
            const caracter = e.key;

            if (caracteresProhibidos.test(caracter)) {
                e.preventDefault();
                campo.style.border = '2px solid red';
                agregarMensaje("No se pueden ingresar los siguientes caracteres especiales: #!&/()");
            }
        }
    })
    if (campo.tagName.toLocaleLowerCase() === 'select') {
        campo.addEventListener('click', () => {
            borrarMensaje(campo);
        })
    }
    if(campo.type === 'checkbox'){
        campo.addEventListener('click', ()=>{
            borrarMensaje(campo);
        })
    }
})

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validarCampos(campos)) {
        if(terminos && !terminos.checked){
             agregarMensaje('Debes aceptar los terminos y condiciones');
        }else{
            enviarDatos(campos);
        }
    }
})

//funcion validacion campos previo a envio de formulario
const validarCampos = (campos) => {
    let valido = true;
    const contrasena = formulario.querySelector('input[id="password"]');
    const contrasena2 = formulario.querySelector('input[id="password2"]');
    campos.forEach((campo) => {
        borrarMensaje(campo);
        if (campo.value.trim() === '') {
            campo.style.border = '2px solid red';
            valido = false;
        }
    })
    if (!valido) {
        agregarMensaje('Todavía hay campos vacíos');
    }
    if (contrasena && contrasena2) {
        if (contrasena.value !== contrasena2.value) {
            contrasena2.style.border = '2px solid red';
            valido = false;
            agregarMensaje('Las contraseñas no coinciden');
        }
    }
    return valido;
}

//mensajes de estado en formularios.
const agregarMensaje = (mensaje) => {
    borrarMensaje();
    const mensajeError = document.createElement('small');
    mensajeError.classList.add('mensaje-error');
    mensajeError.textContent = `${mensaje}`;
    msgValidacion.appendChild(mensajeError);
    msgValidacion.style.visibility = 'visible';
}
//restablece estilo y saca mensaje de estado
const borrarMensaje = (campo) => {
    const mensajeError = msgValidacion.querySelector('small');
    if (mensajeError && mensajeError.classList.contains('mensaje-error')) {
        mensajeError.remove();
        msgValidacion.style.visibility = 'hidden';
    }
    if(campo){
        campo.style.border = '';
    }
}


//funcion envio de formulario
const enviarDatos = async (campos) => {
    const loginForm = document.querySelector('[data-login]'); // Suponiendo que tienes un atributo data-login en el formulario de login

    const mensaje = {};
    campos.forEach((campo) => {
        mensaje[campo.id] = campo.value.trim();
    });

    try {
        let respuesta;
        if (loginForm != null) {
            respuesta = await conexionApi.login(mensaje);
            if (respuesta) window.location.href = 'index.html';
        } else {
            respuesta = await conexionApi.registro(mensaje);
            if (respuesta) alert('Registro exitoso'), window.location.href = 'index.html';
        }
        // alert(`Mensaje enviado correctamente: ${JSON.stringify(respuesta)}`);
        // Aquí podrías hacer algo más después de un login o registro exitoso
    } catch (error) {
        alert(`Error al enviar mensaje: ${error.message}`);
    }
};