// Script para redirigir automáticamente a 404.html cuando el servidor muestra error
(function() {
    // Verificar si el título de la página indica un error 404
    if (document.title && document.title.includes('404')) {
        window.location.href = '/404.html';
        return;
    }

    // Verificar si el contenido del cuerpo indica un error 404
    const bodyText = document.body.innerText.toLowerCase();
    if (bodyText.includes('404') || bodyText.includes('not found') || bodyText.includes('file not found')) {
        window.location.href = '/404.html';
        return;
    }

    // Verificar si hay elementos típicos de error 404
    const errorElements = document.querySelectorAll('h1, h2, title');
    for (let element of errorElements) {
        if (element.textContent && (
            element.textContent.includes('404') ||
            element.textContent.includes('Not Found') ||
            element.textContent.includes('File not found')
        )) {
            window.location.href = '/404.html';
            return;
        }
    }
})();