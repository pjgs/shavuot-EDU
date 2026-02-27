/**
 * Video Facade - Shavuot EDU
 * Reemplaza iframes pesados por miniaturas que cargan instantáneamente.
 * Solo carga el iframe cuando el usuario hace clic.
 */

document.addEventListener('DOMContentLoaded', () => {
    const facades = document.querySelectorAll('.youtube-facade');

    facades.forEach(facade => {
        const videoId = facade.getAttribute('data-id');
        if (!videoId) return;

        // Crear la miniatura si no existe
        if (!facade.querySelector('img')) {
            const img = document.createElement('img');
            // Usamos hqdefault para un balance entre calidad y velocidad
            img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            img.alt = facade.getAttribute('data-title') || 'Video thumbnail';
            img.loading = 'lazy'; // Lazy loading nativo para la imagen
            facade.appendChild(img);
        }

        // Evento de clic para cargar el iframe
        facade.addEventListener('click', function () {
            const iframe = document.createElement('iframe');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            // Autoplay habilitado para que empiece de una vez al hacer clic
            iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);

            // Limpiar fachada e insertar iframe
            this.innerHTML = '';
            this.appendChild(iframe);
            this.classList.remove('youtube-facade'); // Quitar clase para evitar clics repetidos
        });
    });
});
