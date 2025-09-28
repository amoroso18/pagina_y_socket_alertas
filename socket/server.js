const { Server } = require("socket.io");

// Inicializa el servidor de Socket.IO
const io = new Server(3000, {
  cors: {
    origin: "*",
  },
});

// Estructura para almacenar las sesiones de los usuarios
const userSessions = new Map();

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // Recepción de datos de inicio de sesión
  // Recepción de datos de inicio de sesión
  socket.on("login", (user) => {
    const { type, name, lat, lon } = user;

    if (name) {
      const userSession = {
        id: socket.id,
        type,
        name,
        lat,
        lon,
        status: "connected",
      };

      userSessions.set(socket.id, userSession);

      // Unir al usuario a su grupo
      socket.join(type);

      console.log(`Usuario "${name}" agregado al grupo "${type}"`);

      // Notificar al administrador de la nueva conexión
      io.to("Administrador").emit("new_user_connected", userSession);

      // Si es administrador, enviar todos los usuarios y eventos
      if (type === "Administrador") {
        const allUsers = Array.from(userSessions.values()); // Todos los usuarios
        socket.emit("update_user_list", allUsers);
      } else {
        // Notificar solo al grupo correspondiente
        io.to(type).emit("new_user_connected", userSession);

        // Enviar solo la lista de usuarios del mismo grupo
        const groupUsers = Array.from(userSessions.values()).filter(
          (session) => session.type === type
        );
        socket.emit("update_user_list", groupUsers);
      }

    // Notificar al usuario inicial que el login fue exitoso
    socket.emit("login_success", userSession);
    
    }

  });

  // Actualizar coordenadas del usuario en movimiento
  socket.on("update_coordinates", ({ lat, lon, id }) => {
    var userSession = userSessions.get(id);
    if (userSession) {
      userSession.lat = lat;
      userSession.lon = lon;

      userSession = {
        id: id,
        name: userSession.name,
        type: userSession.type,
        lat,
        lon,
      };
      // Notificar solo al grupo del usuario
      io.to(userSession.type).emit("user_coordinates", userSession);
      if (userSession.type != "Administrador") {
        io.to("Administrador").emit("user_coordinates", userSession);
      }
      console.log(
        `Usuario "${userSession.name}" del grupo "${userSession.type}" movido: (${lat}, ${lon})`
      );
    } else {
      console.error(`Usuario con ID "${id}" no encontrado.`);
    }
  });

  // Recepción de informes y envío a un grupo seleccionado
  socket.on("send_report", (report) => {
    io.emit("new_report", report);
  });

  socket.on("send_alert", (alertData) => {
    // io.emit("new_alert", alertData);

    io.to(alertData.group).emit("new_alert", alertData);
      if (alertData.group != "Administrador") {
        io.to("Administrador").emit("new_alert", alertData);
      }
  });
  

  // Terminar una alerta y notificar a todos los grupos
  socket.on("end_alert", (alertData) => {
    io.to(alertData.group).emit("alert_ended", alertData);
    if (alertData.group != "Administrador") {
      io.to("Administrador").emit("alert_ended", alertData);
    }
  });

  // Eliminar una alerta y notificar a todos
  socket.on("delete_alert", (alert) => {
    io.emit("alert_deleted", {
      ...alert,
      user: userSessions.get(socket.id)?.name || "Usuario desconocido",
    });
  });

  // Edición de una sesión
  socket.on("edit_session", (updates) => {
    const userSession = userSessions.get(socket.id);
    if (userSession) {
      Object.assign(userSession, updates);
      socket.emit("session_updated", userSession);
    }
  });

  // Manejar desconexión del cliente
  socket.on("disconnect", () => {
    const disconnectedUser = userSessions.get(socket.id);
    if (disconnectedUser) {
      userSessions.delete(socket.id);
      console.log(`Usuario "${disconnectedUser.name}" desconectado`);
      socket.broadcast.emit("user_disconnected", disconnectedUser.id); // Notificar a los demás
    }
  });
});
