// Leaflet Map Initialization
const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// SweetAlert Example
document.getElementById('alertButton').addEventListener('click', () => {
    swal("¡Hola!", "Integración exitosa con SweetAlert", "success");
});

// Auth Example with JSON Web Token
const jwt = require('jsonwebtoken');
const token = jwt.sign({ username: "usuario" }, "mi_secreto", { expiresIn: "1h" });
console.log("Token generado:", token);
