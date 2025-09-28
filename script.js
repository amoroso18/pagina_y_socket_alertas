document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el envío del formulario

    const userType = document.getElementById('userType').value;
    const name = document.getElementById('name').value;
    const token = document.getElementById('token').value;
    const password = document.getElementById('password').value;

    if (password === '123456') {
        // Guarda el estado de autenticación en localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', userType);
        localStorage.setItem('userName', name);

        alert(`Bienvenido ${name} (${userType})\nToken: ${token}`);
        window.location.href = 'mapa.html'; // Redirige al mapa
    } else {
        alert('Contraseña incorrecta. Intenta nuevamente.');
    }
});
