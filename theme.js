// Bootstrap Dark Mode Switcher
// By Jongwoo Lee.

// Obtiene el tema del sistema operativo
const updateTheme = () => {
    const colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    document.querySelector("html").setAttribute("data-bs-theme", colorMode);
}

// Aplicar el tema
updateTheme()

// Cambiar el tema si se cambia en el sistema operativo
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme)
