const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// Servir archivos estáticos
app.use(express.static('.'));

// Para todas las rutas que no coincidan con archivos estáticos
// redirigir a la página 404.html
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});