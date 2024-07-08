import auth from "./auth.js";

export const apiUrl = 'https://pablo-rvs.alwaysdata.net';

const consultarApi = async (url, opciones = {}) => {
    const respuesta = await fetch(url, opciones);
    if (!respuesta.ok) {
        throw new Error(`HTTP error! Status: ${respuesta.status}`);
    }
    return await respuesta.json();
};

const login = async (params) => {
    const opciones = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Indica que incluya las credenciales en la solicitud (incluyendo cookies)
        body: JSON.stringify(params),
    };
    try {
        const respuesta = await fetch(`${apiUrl}/usuario/login`, opciones);
        const datos = await respuesta.json();
        if (datos.access_token && datos.rol) {
            auth.login(datos.access_token, datos.rol);
        }
        return datos;
    } catch (error) {
        console.error('Error en login:', error);
        throw error; // Re-lanza el error para manejarlo en enviarDatos
    }
}

const registro = async (params) => {
    const opciones = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    };
    try {
        const respuesta = await consultarApi(`${apiUrl}/usuario/register`, opciones);
        return respuesta; // Devuelve la respuesta para manejarla en enviarDatos
    } catch (error) {
        console.error('Error en registro:', error);
        throw error; // Re-lanza el error para manejarlo en enviarDatos
    }
};

const obtenerDatosUsuarios = async () => {
    if (auth.checkAuth()) {
        const token = sessionStorage.getItem('token');
        const opciones = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        const respuesta = await consultarApi(`${apiUrl}/usuarios/datosSesion`, opciones);
        return respuesta;
    } else {
        console.log('Restringido!!! No hay sesion activa');
    }
}

const modificarDatosUsuario = async (params, id) => {
    if (auth.checkAuth()) {
        const token = sessionStorage.getItem('token');
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
        };
        try {
            const respuesta = await consultarApi(`${apiUrl}/usuarios/${id}`, opciones);
            return respuesta; // Devuelve la respuesta para manejarla en enviarDatos
        } catch (error) {
            console.error('Error en registro:', error);
            throw error; // Re-lanza el error para manejarlo en enviarDatos
        }
    } else {
        console.log('Restringido!!! No hay sesion activa');
    }
};

const modificarPassword = async (params, id) => {
    if (auth.checkAuth()) {
        const token = sessionStorage.getItem('token');
        const opciones = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
        };
        try {
            const respuesta = await consultarApi(`${apiUrl}/usuarios/cambiarPass`, opciones);
            return respuesta; // Devuelve la respuesta para manejarla en enviarDatos
        } catch (error) {
            console.error('Error en registro:', error);
            throw error; // Re-lanza el error para manejarlo en enviarDatos
        }
    } else {
        console.log('Restringido!!! No hay sesion activa');
    }
};

const listarUsuarios = async () => {
    if (auth.checkAuth()) {
        const token = sessionStorage.getItem('token');
        const opciones = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        const respuesta = await consultarApi(`${apiUrl}/usuarios/lista`, opciones);
        return respuesta;
    } else {
        console.log('Restringido!!! No hay sesion activa');
    }
}

const adminModificarRol = async (params) => {
    console.log(params);
    if (auth.checkAuth()) {
        const token = sessionStorage.getItem('token');
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
        };
        try {
            const respuesta = await consultarApi(`${apiUrl}/usuarios/modificarRol`, opciones);
            return respuesta; // Devuelve la respuesta para manejarla en enviarDatos
        } catch (error) {
            console.error('Error en registro:', error);
            throw error; // Re-lanza el error para manejarlo en enviarDatos
        }
    } else {
        console.log('Restringido!!! No hay sesion activa');
    }
};

const adminEliminarUsuario = async (id) =>{
    if (auth.checkAuth()) {
        const token = sessionStorage.getItem('token');
        const opciones = {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };
        try {
            const respuesta = await consultarApi(`${apiUrl}/usuarios/${id}`, opciones);
            return respuesta; // Devuelve la respuesta para manejarla en enviarDatos
        } catch (error) {
            console.error('Error en registro:', error);
            throw error; // Re-lanza el error para manejarlo en enviarDatos
        }
    } else {
        console.log('Restringido!!! No hay sesion activa');
    }
}

const borrarEvento = async(id) =>{
    if (auth.checkAuth()) {
        const token = sessionStorage.getItem('token');
        const opciones = {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };
        try {
            const respuesta = await consultarApi(`${apiUrl}/eventos/${id}`, opciones);
            return respuesta; // Devuelve la respuesta para manejarla en enviarDatos
        } catch (error) {
            console.error('Error en registro:', error);
            throw error; // Re-lanza el error para manejarlo en enviarDatos
        }
    } else {
        console.log('Restringido!!! No hay sesion activa');
    }
}

const eventosOrganizador = async () => {
    if (auth.checkAuth()) {
        const token = sessionStorage.getItem('token');
        const opciones = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        const respuesta = await consultarApi(`${apiUrl}/eventos/eventosOrganizador`, opciones);
        return respuesta;
    } else {
        console.log('Restringido!!! No hay sesion activa');
    }
}

const obtenerEventoId = async (id)=>{
    if (auth.checkAuth()) {
        const token = sessionStorage.getItem('token');
        const opciones = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        const respuesta = await consultarApi(`${apiUrl}/eventos/${id}`, opciones);
        return respuesta;
    } else {
        console.log('Restringido!!! No hay sesion activa');
    }
}

const eventoModificar = async (params, id) => {
    console.log(`Datos evento a modificar ${JSON.stringify(params)} id ${id}` );
    if (auth.checkAuth()) {
        const token = sessionStorage.getItem('token');
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
        };
        try {
            const respuesta = await consultarApi(`${apiUrl}/eventos/${id}`, opciones);
            return respuesta; // Devuelve la respuesta para manejarla en enviarDatos
        } catch (error) {
            console.error('Error en registro:', error);
            throw error; // Re-lanza el error para manejarlo en enviarDatos
        }
    } else {
        console.log('Restringido!!! No hay sesion activa');
    }
};

const eventoCrear = async (params) => {
    console.log(`Datos evento a modificar ${JSON.stringify(params)}` );
    if (auth.checkAuth()) {
        const token = sessionStorage.getItem('token');
        const opciones = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
        };
        try {
            const respuesta = await consultarApi(`${apiUrl}/eventos/`, opciones);
            return respuesta; // Devuelve la respuesta para manejarla en enviarDatos
        } catch (error) {
            console.error('Error en registro:', error);
            throw error; // Re-lanza el error para manejarlo en enviarDatos
        }
    } else {
        console.log('Restringido!!! No hay sesion activa');
    }
};

const obtenerEntradas = async(id) =>{
    if (auth.checkAuth()) {
        const token = sessionStorage.getItem('token');
        const opciones = {
            method: 'GET',
        };
        const respuesta = await consultarApi(`${apiUrl}/entrada/${id}`, opciones);
        return respuesta;
    } else {
        console.log('Restringido!!! No hay sesion activa');
    }
}

const entradaModificar = async (params, id) => {
    console.log(`Datos de entrada a modificar ${JSON.stringify(params)} id ${id}` );
    if (auth.checkAuth()) {
        const token = sessionStorage.getItem('token');
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
        };
        try {
            const respuesta = await consultarApi(`${apiUrl}/entradas/org/${id}`, opciones);
            return respuesta; // Devuelve la respuesta para manejarla en enviarDatos
        } catch (error) {
            console.error('Error en registro:', error);
            throw error; // Re-lanza el error para manejarlo en enviarDatos
        }
    } else {
        console.log('Restringido!!! No hay sesion activa');
    }
};

const comprarEntradas = async (params, id) => {
    console.log(`Datos de entrada a comprar ${JSON.stringify(params)} id ${id}` );
    if (auth.checkAuth()) {
        const token = sessionStorage.getItem('token');
        const opciones = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
        };
        try {
            const respuesta = await consultarApi(`${apiUrl}/entradas/compra/${id}`, opciones);
            return respuesta; // Devuelve la respuesta para manejarla en enviarDatos
        } catch (error) {
            console.error('Error en registro:', error);
            throw error; // Re-lanza el error para manejarlo en enviarDatos
        }
    } else {
        console.log('Restringido!!! No hay sesion activa');
    }
}


export const conexionApi = {
    consultarApi, login, registro, obtenerDatosUsuarios, modificarDatosUsuario, modificarPassword, 
    listarUsuarios, adminModificarRol, adminEliminarUsuario, borrarEvento, eventosOrganizador, obtenerEventoId, 
    eventoModificar, eventoCrear, obtenerEntradas,entradaModificar, comprarEntradas
}