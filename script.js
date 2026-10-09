// ABRIR INVITACIÓN Y REPRODUCIR MÚSICA AUTOMÁTICAMENTE
function abrirInvitacion() {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.style.display = "none";
    }, 800);
  }

  var audio = document.getElementById("musica");
  if (audio) {
    audio.volume = 0.5;
    audio.play().then(() => {
      console.log("Música iniciada correctamente.");
    }).catch(function(error) {
      console.log("Error al reproducir audio: ", error);
    });
  }
}

// GENERADOR DINÁMICO DE LLUVIA DE ESTRELLAS
function crearEstrellas() {
  const container = document.getElementById('estrellas-container');
  if (!container) return;

  for (let i = 0; i < 35; i++) {
    const estrella = document.createElement('div');
    estrella.className = 'estrella';
    estrella.innerText = '✨';
    estrella.style.left = Math.random() * 98 + 'vw';
    estrella.style.animationDuration = (Math.random() * 3 + 2) + 's';
    estrella.style.animationDelay = (Math.random() * 5) + 's';
    estrella.style.fontSize = (Math.random() * 12 + 18) + 'px';
    container.appendChild(estrella);
  }
}

document.addEventListener("DOMContentLoaded", crearEstrellas);

// RELOJ CUENTA REGRESIVA (Ajustar año, mes -1, día, hora)
const fechaEvento = new Date(2026, 10, 15, 21, 0, 0).getTime();

setInterval(function() {
  const ahora = new Date().getTime();
  const diferencia = fechaEvento - ahora;

  if (diferencia > 0) {
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    const dEl = document.getElementById("dias");
    const hEl = document.getElementById("horas");
    const mEl = document.getElementById("minutos");
    const sEl = document.getElementById("segundos");

    if (dEl) dEl.innerText = dias < 10 ? '0' + dias : dias;
    if (hEl) hEl.innerText = horas < 10 ? '0' + horas : horas;
    if (mEl) mEl.innerText = minutos < 10 ? '0' + minutos : minutos;
    if (sEl) sEl.innerText = segundos < 10 ? '0' + segundos : segundos;
  }
}, 1000);