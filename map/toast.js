  const showToast = (message, color) => {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  };

  const ToastConectado = (message) => {
    Toastify({
        text: `${message.type} Conectado: ${message.name}`,
      duration: 5000,
      close: true,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  };

  const ToastDesconectado = () => {
    Toastify({
        text: "Usuario desconectado",
        duration: 5000,
      close: true,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #f2fb3f, #fc466b)",
      },
    }).showToast();
  };


  const ToastNotificacion = () => {
    Toastify({
      text: "Nueva Alerta",
      duration: 5000,
      close: true,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #ff0029, #8f00ff)",
      },
    }).showToast();
  };

  const ToastReporte = () => {
    Toastify({
      text: "Nueva Reporte",
      duration: 5000,
      close: true,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #3fdffb, #464efc)",
      },
    }).showToast();
  };
