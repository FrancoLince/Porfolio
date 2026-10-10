// ==== Variables globales ====
const toggleBtn = document.getElementById("toggleMode");
const body = document.body;
const btnTop = document.getElementById("btnTop");
const sobreMiSection = document.getElementById("sobre-mi");
const expandButtons = document.querySelectorAll(".btn-expand");
const form = document.querySelector("form");

// ==== Animación "fadeInUp" ====
function fadeInUp(element, delay = 0) {
    element.animate(
        [
            { opacity: 0, transform: "translateY(20px)" },
            { opacity: 1, transform: "translateY(0)" }
        ],
        {
            duration: 1000,
            delay: delay,
            fill: "forwards",
            easing: "ease-out"
        }
    );
}

// ==== Aplicar fadeInUp a distintos elementos ====
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section");
    const proyectos = document.querySelectorAll(".proyecto");
    const redes = document.querySelectorAll(".redes");
    const forms = document.querySelectorAll("form");

    sections.forEach((sec, i) => fadeInUp(sec, i * 200));
    proyectos.forEach((p, i) => fadeInUp(p, i * 200));
    redes.forEach((r, i) => fadeInUp(r, i * 200));
    forms.forEach((f, i) => fadeInUp(f, i * 200));
});

// ==== Hover personalizado ====
function addHoverAnimation(selector, keyframes, options) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.addEventListener("mouseenter", () => el.animate(keyframes, options));
        el.addEventListener("mouseleave", () => el.animate([...keyframes].reverse(), options));
    });
}

addHoverAnimation(".perfil", [
    { transform: "scale(1)", boxShadow: "0 0 20px rgba(255,94,98,0.5)" },
    { transform: "scale(1.1)", boxShadow: "0 0 30px rgba(255,94,98,0.7)" }
], { duration: 300, fill: "forwards" });

addHoverAnimation(".proyecto img, .proyecto video, .proyecto iframe", [
    { transform: "scale(1)", boxShadow: "0 8px 25px rgba(0,0,0,0.5)" },
    { transform: "scale(1.05)", boxShadow: "0 15px 40px rgba(0,0,0,0.7)" }
], { duration: 400, fill: "forwards" });

addHoverAnimation(".redes img", [
    { transform: "scale(1) rotate(0deg)", boxShadow: "0 0 0 rgba(0,0,0,0)" },
    { transform: "scale(1.2) rotate(10deg)", boxShadow: "0 0 15px rgba(255,94,98,0.7)" }
], { duration: 300, fill: "forwards" });

addHoverAnimation("form button, .btn-expand, #toggleMode", [
    { transform: "scale(1)", boxShadow: "0 0 0 rgba(0,0,0,0)" },
    { transform: "scale(1.05)", boxShadow: "0 8px 20px rgba(255,94,98,0.7)" }
], { duration: 300, fill: "forwards" });

// ==== BOTÓN VOLVER ARRIBA ====
window.addEventListener("scroll", () => {
    const sectionTop = sobreMiSection.getBoundingClientRect().top;
    if (sectionTop < window.innerHeight) {
        btnTop.classList.add("show");
    } else {
        btnTop.classList.remove("show");
    }
});

btnTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==== EFECTO DINÁMICO PARA PROYECTOS/TESTIMONIOS ====
expandButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const extraContent = btn.previousElementSibling;
        if(extraContent.style.display === "none" || extraContent.style.display === "") {
            extraContent.style.display = "block";
            btn.textContent = "Mostrar menos";
        } else {
            extraContent.style.display = "none";
            btn.textContent = "Mostrar más";
        }
    });
});

// ==== BOTÓN MODO OSCURO/CLARO + LocalStorage + Ícono ====
if (localStorage.getItem("theme") === "light") {
    body.classList.add("light-mode");
    toggleBtn.textContent = "☀️";
} else {
    body.classList.remove("light-mode");
    toggleBtn.textContent = "🌙";
}

toggleBtn.addEventListener("click", () => {
    body.classList.toggle("light-mode");

    if (body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
        toggleBtn.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "dark");
        toggleBtn.textContent = "🌙";
    }
});

// ==== FECHA ACTUAL EN EL PIE DE PÁGINA ====
const footer = document.createElement("footer");
footer.style.textAlign = "center";
footer.style.marginTop = "30px";
footer.style.padding = "15px";
footer.style.color = "#ccc";
footer.style.fontSize = "0.9rem";

const fecha = new Date();
const opciones = { day: "2-digit", month: "long", year: "numeric" };
footer.textContent = `© ${fecha.toLocaleDateString("es-ES", opciones)} - Franco Linceklinger`;
document.body.appendChild(footer);

// ==== VALIDACIÓN DEL FORMULARIO ====
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("name").value.trim();
    const mensaje = document.getElementById("message").value.trim();

    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!regexNombre.test(nombre)) {
        alert("El nombre solo puede contener letras y espacios.");
        return;
    }

    if (mensaje.length > 250) {
        alert("El mensaje no puede superar los 250 caracteres.");
        return;
    }

    alert("✅ Mensaje enviado con éxito, gracias por contactarme!");
    form.reset();
});
// ==== API DEL CLIMA ====
const API_KEY = "7f486676f629beaad86dd99ac9a31de4";
const botonClima = document.getElementById("buscarClima");
const inputCiudad = document.getElementById("ciudad");

// Evento: clic en el botón
botonClima.addEventListener("click", () => {
  const ciudad = inputCiudad.value.trim();
  if (ciudad !== "") {
    obtenerClimaPorCiudad(ciudad);
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(obtenerClimaPorUbicacion, mostrarError);
  } else {
    alert("Tu navegador no soporta geolocalización.");
  }
});

// === Clima por ciudad ===
function obtenerClimaPorCiudad(ciudad) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=${API_KEY}&units=metric&lang=es`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      return res.json();
    })
    .then(data => mostrarDatosClima(data))
    .catch(error => {
      console.error("Error al obtener el clima:", error);
      alert("No se pudo obtener el clima. Verificá el nombre de la ciudad.");
    });
}

// === Clima por ubicación (geolocalización) ===
function obtenerClimaPorUbicacion(pos) {
  const { latitude, longitude } = pos.coords;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=es`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      return res.json();
    })
    .then(data => mostrarDatosClima(data))
    .catch(error => {
      console.error("Error al obtener el clima:", error);
      alert("No se pudo obtener el clima desde tu ubicación.");
    });
}

// === Mostrar los datos ===
function mostrarDatosClima(data) {
  document.getElementById("ubicacion").textContent = `Ubicación: ${data.name}`;
  document.getElementById("temperatura").textContent = `Temperatura: ${data.main.temp}°C`;
  document.getElementById("descripcion").textContent = `Descripción: ${data.weather[0].description}`;
  document.getElementById("humedad").textContent = `Humedad: ${data.main.humidity}%`;

  const iconCode = data.weather[0].icon;
  document.getElementById("icono").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById("icono").alt = data.weather[0].description;
}

// === Errores de geolocalización ===
function mostrarError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("Permiso de ubicación denegado por el usuario.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Información de ubicación no disponible.");
      break;
    case error.TIMEOUT:
      alert("Tiempo de espera agotado al obtener ubicación.");
      break;
    default:
      alert("Error desconocido al obtener ubicación.");
  }
}
