// Favicon Loader - Carga el favicon dinámicamente en todas las páginas
(function() {
    // Determinar la ruta correcta según la ubicación de la página
    const currentPath = window.location.pathname;
    let faviconPath = 'favicoin-shavuot-system.svg';
    
    // Si estamos en una subcarpeta (PRO, EDU, etc.), ajustar la ruta
    if (currentPath.includes('/PRO/') || currentPath.includes('/EDU/')) {
        faviconPath = '../favicoin-shavuot-system.svg';
    }
    
    // Crear el elemento link para el favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = faviconPath;
    
    // Agregar al head
    document.head.appendChild(link);
    
    // También agregar versión PNG como fallback para navegadores antiguos
    const linkPng = document.createElement('link');
    linkPng.rel = 'alternate icon';
    linkPng.type = 'image/png';
    linkPng.href = faviconPath.replace('.svg', '.png');
    
    document.head.appendChild(linkPng);
})();
