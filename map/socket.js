const socket = io("http://localhost:3000");
let SESIONID;
const INTERVAL_TIME = 3000;
// Iniciar sesión
// Función para obtener un valor de localStorage
const getLocalStorageItem = async (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    return value ? value : defaultValue; // Devuelve el valor o el valor por defecto
  } catch (error) {
    console.error(`Error al obtener el item ${key} de localStorage:`, error);
    return defaultValue;
  }
};

// Función principal para obtener los datos del usuario
const getUserInfo = async () => {
  const userName = await getLocalStorageItem("userName", "Usuario");
  const userType = await getLocalStorageItem("userType", "Undefined");
  return { userName, userType };
};

// Uso de la función
(async () => {
  const { userName, userType } = await getUserInfo();
  console.log(`Usuario: ${userName}, Tipo: ${userType}`);
  socket.emit("login", {
    type: userType,
    name: userName,
    lat: -12.0464,
    lon: -77.0428,
  });
})();

// Escuchar eventos
socket.on("login_success", (session) => {
  SESIONID = { ...session };  
  startLocationInterval();
});

// Manejar el evento de un nuevo usuario conectado
socket.on("new_user_connected", (user) => {
  ToastConectado(user);
  addMarker(
    usersLayer,
    user.lat,
    user.lon,
    createicons(user.type),
    `Conectado`,
    `${user.type}`,
    user.id
  );
});

// Manejar la lista completa de usuarios conectados
socket.on("update_user_list", (allUsers) => {
  allUsers.forEach((user) => {
    addMarker(
      usersLayer,
      user.lat,
      user.lon,
      createicons(user.type),
      `Conectado`,
      `${user.type}`,
      user.id
    );
  });
});

// Manejar el evento de un usuario desconectado
socket.on("user_disconnected", (userId) => {
  ToastDesconectado();
  removeMarker(userId); // Asegúrate de implementar removeMarker para eliminar el marcador
});

socket.on("user_coordinates", ({ id, name, type, lat, lon }) => {
  const marker = getMarkerById(id); // Encuentra el marcador por su ID personalizado
  if (marker) {
    marker.setLatLng([lat, lon]); // Actualiza la posición del marcador en el mapa
    // console.log(`Posición actualizada: ${name} (${lat}, ${lon})`);
  } else {
    // console.warn(
    //   `No se encontró marcador para el usuario "${name}" con ID "${id}"`
    // );
  }
});

socket.on("new_report", (report) => {
  console.log("Nuevo reporte recibido:", report);
  // Agregar un marcador al mapa con los datos del reporte
  addMarker(
    alertsLayer,
    report.lat,
    report.lon,
    createicons("Notificación"),
    `${report.text}`,
    "Notificación",
    report.id
  );

  ToastReporte();
  addNotification("Notificación", report.text, report.id);
});

socket.on("new_alert", (alert) => {
  console.log("Nueva alerta recibida:", alert);

  // Agregar un marcador al mapa con los datos de la alerta
  addMarker(
    alertsLayer,
    alert.lat,
    alert.lon,
    createicons("Alerta"),
    `${alert.text}`,
    "Alerta",
    alert.id
  );
  ToastNotificacion();
  addNotification("Alerta", alert.text, alert.id);

});


socket.on("alert_deleted", (alert) => {
  deleteNotificationSocket(alert);
});

socket.on("alert_ended", (alert) => {
  markAsCompletedSocket(alert);
});


function startLocationInterval() {
  if (navigator.geolocation) {
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Obtiene las coordenadas actuales
          const currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          // Agrega las coordenadas al objeto SESIONID
          SESIONID.lat = currentPosition.latitude;
          SESIONID.lon = currentPosition.longitude;

          // Envía las coordenadas al servidor
          socket.emit("update_coordinates", SESIONID);
          console.log("Coordenadas enviadas:", SESIONID);
        },
        (error) => {
          console.error("Error obteniendo la geolocalización:", error.message);
        },
        {
          enableHighAccuracy: true,
        }
      );
    }, INTERVAL_TIME); // Ejecuta cada 5 segundos
  } else {
    console.error("La API de Geolocalización no está soportada en este navegador.");
  }
}

// Verifica si las coordenadas han cambiado significativamente
function hasMoved(previous, current) {
  return previous.latitude !== current.latitude || previous.longitude !== current.longitude;
}

// Inicia la emisión de ubicación