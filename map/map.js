const map = L.map("map").setView([-12.04318, -77.02824], 13); // Coordenadas de Lima, Perú
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Definir los iconos personalizados

var iconHospital = L.icon({
  iconUrl: "icons/ambulancia.png", // Ruta a la imagen del icono
  iconSize: [32, 32], // Tamaño del icono
  iconAnchor: [16, 32], // Ancla del icono (donde estará la punta del marcador)
  popupAnchor: [0, -32], // Ubicación del popup
});

var iconBombero = L.icon({
  iconUrl: "icons/camion-de-bomberos.png", // Ruta a la imagen del icono
  iconSize: [32, 32], // Tamaño del icono
  iconAnchor: [16, 32], // Ancla del icono (donde estará la punta del marcador)
  popupAnchor: [0, -32], // Ubicación del popup
});

var iconSerenazgo = L.icon({
  iconUrl: "icons/guardia.png", // Ruta a la imagen del icono
  iconSize: [32, 32], // Tamaño del icono
  iconAnchor: [16, 32], // Ancla del icono (donde estará la punta del marcador)
  popupAnchor: [0, -32], // Ubicación del popup
});

var iconPolicia = L.icon({
  iconUrl: "icons/coche-de-policia.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

var iconProfesor = L.icon({
  iconUrl: "icons/profesor.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

var iconSeguridad = L.icon({
  iconUrl: "icons/oficial-de-policia.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

var iconAdministrador = L.icon({
  iconUrl: "icons/administrador.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

var iconAlerta = L.divIcon({
  className: "icon-alerta", // Clase que define el parpadeo
  html: `<img src="icons/alerta.png" style="width: 32px; height: 32px;">`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

var iconNotificacion = L.divIcon({
  className: "icon-rebote", // Clase que define el rebote
  html: `<img src="icons/notifica.png" style="width: 32px; height: 32px;">`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function createicons(icon) {
  switch (icon) {
    case "Hospital":
      return iconHospital;
    case "Bombero":
      return iconBombero;
    case "Serenazgo":
      return iconSerenazgo;
    case "Policía":
      return iconPolicia;
    case "Profesor":
      return iconProfesor;
    case "Seguridad Universitaria":
      return iconSeguridad;
    case "Administrador":
      return iconAdministrador;
    case "Alerta":
      return iconAlerta;
    case "Notificacion":
      return iconNotificacion;
    default:
      return iconNotificacion;
  }
}

const usersLayer = L.layerGroup().addTo(map);
const notificationsLayer = L.layerGroup().addTo(map);
const alertsLayer = L.layerGroup().addTo(map);

const markerMap = new Map();

const addMarker = (layer, lat, lng, icon, status, type, customId) => {
  // Verificar si el marcador ya existe en markerMap
  if (markerMap.has(customId)) {
    const existingMarker = markerMap.get(customId);
    console.log(
      `Marker with ID ${customId} already exists. Updating position.`
    );
    existingMarker.setLatLng([lat, lng]); // Actualizar posición si ya existe
    return existingMarker; // Retorna el marcador existente
  }

  // Crear un nuevo marcador si no existe
  const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(layer);

  // Asociar el ID personalizado al marcador
  marker.customId = customId; // Agregar un campo customId al marcador

  // Almacenar el marcador en markerMap para acceder fácilmente
  markerMap.set(customId, marker);

  // Bind popup con opciones
  marker.bindPopup(`
          <strong>${type}</strong><br>
          <strong>${status}</strong><br>
          <span class="text-muted">Codigo: ${customId}</span><br>
        `);

  // Event listener para movimiento del marcador
  marker.on("dragend", (e) => {
    const { lat, lng } = e.target.getLatLng();
    console.log(`Marker ${customId} moved to: ${lat}, ${lng}`);
    const userupdate = {
      id: customId,
      type: type,
      lat: lat,
      lon: lng,
      status: "connected",
    };
    socket.emit("update_coordinates", userupdate); // Emitir la nueva posición al socket
  });

  return marker;
};

// Función para encontrar un marcador por ID personalizado
const getMarkerById = (customId) => {
  return markerMap.get(customId);
};
// Función para eliminar un marcador
const removeMarker = (customId) => {
  const marker = getMarkerById(customId);
  if (marker) {
    markerMap.delete(customId); // Eliminar de markerMap
    marker.remove(); // Eliminar del mapa
    console.log(`Marker ${customId} removed`);
  } else {
    console.error(`Marker with ID ${customId} not found`);
  }
};

// Función para editar un marcador (placeholder para personalización)
const editMarker = (customId) => {
  const marker = getMarkerById(customId);
  if (marker) {
    console.log(`Editing marker ${customId}`);
    // Aquí puedes implementar la lógica de edición
  } else {
    console.error(`Marker with ID ${customId} not found`);
  }
};

function centerOnMarker(event) {
  // Obtener el elemento que disparó el evento
  const button = event.target;

  // Obtener el atributo data-id del botón
  const customId = button.dataset.id;

  // Buscar el marcador con ese ID en markerMap
  const marker = markerMap.get(customId);
  if (marker) {
    const latLng = marker.getLatLng(); // Obtener las coordenadas del marcador
    map.setView(latLng, 15); // Centrar el mapa en la posición del marcador con zoom
    marker.openPopup(); // Abrir el popup del marcador (opcional)
  } else {
    console.warn(`No se encontró marcador con ID ${customId}`);
  }
}

// document.getElementById("addNotification2").addEventListener("click", () => {
//   const now = new Date();
//   const customId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}${String(now.getMilliseconds()).padStart(3, "0")}`;

//   const title = "Peligro";
//   const description = "Hay varias motos sin placa en la avenida";
//   const container = {
//     id: customId,
//     customId: customId,
//     lat: -12.04318,
//     lon: -77.02824,
//     text: `${title} : ${description}`,
//     timestamp: new Date().toISOString(),
//   };
//   socket.emit("send_report", container);
// });

// document.getElementById("addAlert").addEventListener("click", () => {
//   const now = new Date();
//   const customId = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}${String(now.getMilliseconds()).padStart(3, "0")}`;
//   const container = {
//     id: customId,
//     customId: customId,
//     group: "Policía",
//     lat: -12.04318,
//     lon: -77.02824,
//     text: `Necesito ayuda`,
//     timestamp: new Date().toISOString(),
//   };
//   socket.emit("send_alert", container);
// });
