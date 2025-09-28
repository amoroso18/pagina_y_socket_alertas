
// Inicialización
const notificationList = document.getElementById('notificationList');


// Manejo de notificaciones
let notifications = [];

function renderNotifications() {
    notificationList.innerHTML = ''; // Limpia la lista
    notifications.forEach((notification, index) => {
        const notificationElement = document.createElement('div');
        notificationElement.className = 'notification';
        notificationElement.innerHTML = `
                <div class="card p-3">
                    <strong>${notification.message}
                        <span class="badge bg-${notification.status === 'pending' ? 'warning' : 'success'}">
                            ${notification.status === 'pending' ? 'Pendiente' : 'Completada'}
                        </span>
                    </strong>
                     <p>${notification.text}</p>
 <a>Fecha ${notification.status === 'pending' ? 'Pendiente' : 'Completada'}: ${notification.status === 'pending' ? notification.pendingDate : notification.completedDate || '-'
            }
                </a>
                   <a> ${notification.completedBy ? `Usuario: ${notification.completedBy}` : ''}</a>
                    <div >
                        <button class="btn btn-sm btn-info" data-id="${notification.customId}" onclick="centerOnMarker(event)">Ver</button>
                        <button class="btn btn-sm btn-primary" data-index="${index}" data-id="${notification.customId}" onclick="markAsCompleted(event)">Completar</button>
                        <button class="btn btn-sm btn-danger"  data-index="${index}" data-id="${notification.customId}" onclick="deleteNotification(event)">Eliminar</button>
                    </div>
                    </div>

                `;
        notificationList.appendChild(notificationElement);
    });
}

function addNotification(type, text, customId) {
    const newNotification = {
        message: `${type}`,
        text: text,
        customId: customId,
        status: 'pending',
        pendingDate: new Date().toLocaleString(),
        completedDate: null,
        completedBy: null,
    };
    notifications.push(newNotification);
    renderNotifications();
}

function deleteNotification(event) {
    const button = event.target;
    const customId = button.dataset.id;
    removeMarker(customId);
    // Filtrar la notificación del array notifications
    notifications = notifications.filter(notification => notification.customId !== customId);
    // Renderizar nuevamente las notificaciones
    renderNotifications();
    socket.emit("delete_alert", {
        customId: customId
    });
}

function markAsCompleted(event) {
    const button = event.target;
    const customId = button.dataset.id;
    const customIndex = button.dataset.index;
    const notification = notifications[customIndex];
    notification.status = 'Completado';
    var competedatefinish = new Date().toLocaleString();
    notification.completedDate = competedatefinish;
    notification.completedBy = userName;
    socket.emit("end_alert", {
        group: userType,
        customId: customId,
        status: 'Completado',
        completedDate: competedatefinish,
        completedBy: userName,
    });
    renderNotifications();

}

// Eventos
function deleteNotificationSocket(ALERTA_SOCKET) {
    removeMarker(ALERTA_SOCKET.customId);
    notifications = notifications.filter(notification => notification.customId !== ALERTA_SOCKET.customId);
    renderNotifications();
}

function markAsCompletedSocket(ALERTA_SOCKET) {
    // Buscar la notificación por customId
    const notification = notifications.find(notification => notification.customId == ALERTA_SOCKET.customId);

    // Si la notificación existe, actualiza sus propiedades
    if (notification) {
        notification.status = ALERTA_SOCKET.status;
        notification.completedDate = ALERTA_SOCKET.completedDate;
        notification.completedBy = `${ALERTA_SOCKET.completedBy} (${ALERTA_SOCKET.group})`;
        renderNotifications(); // Renderiza nuevamente la lista de notificaciones
    } else {
        console.error(`Notificación con customId ${ALERTA_SOCKET.customId} no encontrada.`);
    }
}
// Botón de cerrar sesión
document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    alert('Sesión cerrada correctamente.');
    window.location.href = 'login.html';
});

// Render inicial
renderNotifications();