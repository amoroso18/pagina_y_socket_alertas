const userName = localStorage.getItem('userName') || 'Usuario';
const userType = localStorage.getItem("userType", "Undefined");

document.getElementById('userName').textContent = userName;
document.getElementById('userType').textContent = userType;


if (!localStorage.getItem('isLoggedIn')) {
    alert('No tienes permiso para acceder. Por favor, inicia sesión.');
    window.location.href = 'login.html'; 
}