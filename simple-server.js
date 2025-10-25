const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;

const server = http.createServer((req, res) => {
    // Parsear la URL
    const parsedUrl = url.parse(req.url);
    let filePath = parsedUrl.pathname;

    // Si es la raíz, servir index.html
    if (filePath === '/' || filePath === '') {
        filePath = '/index.html';
    }

    // Construir la ruta completa del archivo
    filePath = path.join(__dirname, filePath);

    // Verificar la extensión para el Content-Type
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpg';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
    }

    // Leer el archivo
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Archivo no encontrado, servir 404.html
                fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
                    if (err) {
                        // Si ni siquiera 404.html existe, enviar error 404 genérico
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<html><body><h1>404 Not Found</h1><p>Página no encontrada</p></body></html>');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content);
                    }
                });
            } else {
                // Error del servidor
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<html><body><h1>Error 500</h1><p>Error interno del servidor</p></body></html>');
            }
        } else {
            // Archivo encontrado, servirlo
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('Para probar 404, visita: http://localhost:8000/archivo-inexistente.html');
});