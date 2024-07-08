// auth.js
const auth = {
    checkAuth() {
        return !!sessionStorage.getItem('token');
    },

    checkRol(rol){
        const session = sessionStorage.getItem('rol');
        if(session) return session == rol;
    },

    login(token, rol) {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('rol', rol);
        this.updateNav();
    },

    logout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('rol');
        this.updateNav();
        window.location.href = 'index.html';
    },

    updateNav() {
        const isLoggedIn = this.checkAuth();
        const navLinksContainer = document.querySelector('.navLinks');
        const fragmentPath = isLoggedIn ? siLog() : noLog;
        navLinksContainer.outerHTML = fragmentPath;

        if(isLoggedIn)document.getElementById('logoutButton').addEventListener('click', () => this.logout());
        // fetch(fragmentPath)
        //     .then(response => response.text())
        //     .then(html => {
        //         navLinksContainer.outerHTML = html;
        //         if (isLoggedIn) {
        //             document.getElementById('logoutButton').addEventListener('click', () => this.logout());
        //         }
        //     })
        //     .catch(error => console.error('Error al cargar el fragmento:', error));
    }
};

const siLog = () => {
    const nav = `<ul class="navLinks">
        <li><a href="acercade.html">Acerca de</a></li>
        <li><a href="soporte.html">Soporte</a></li>
        ${auth.checkRol('Organizador') ? '<li><a href="organizador.html">Mis eventos</a></li>' : ''}
        ${auth.checkRol('Administrador') ? '<li><a href="administrador.html">Gestion</a></li>' : ''}
        <li><a href="perfil.html">Perfil</a></li>
        <li><button id="logoutButton">Logout</button></li>
    </ul>`;
    return nav;
};

    
const noLog = `
<ul class="navLinks">
    <li><a href="acercade.html">Acerca de</a></li>
    <li><a href="soporte.html">Soporte</a></li>
    <li><a href="registrar.html">Registrar</a></li>
    <li><a href="login.html">Iniciar sesión</a></li>
</ul
`;

document.addEventListener('DOMContentLoaded', () => {
    auth.updateNav();
});

export default auth;
