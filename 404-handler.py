#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8000

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def send_response_only(self, code, message=None):
        """Override to add custom headers"""
        super().send_response_only(code, message)
        if code == 404:
            self.send_header('Location', '/404.html')
            self.end_headers()

    def do_GET(self):
        # Convertir la URL a ruta del sistema de archivos
        path = self.path.lstrip('/')

        # Si es la raíz, servir index.html
        if not path or path == '':
            path = 'index.html'

        # Verificar si el archivo existe
        if not os.path.exists(path):
            # Si no existe, redirigir a 404.html
            self.path = '/404.html'
            self.send_response(404)
            return super().do_GET()

        # Si existe, servirlo normalmente
        return super().do_GET()

print(f"Iniciando servidor en http://localhost:{PORT}")
print("Para probar 404, visita: http://localhost:8000/archivo-inexistente.html")
print("Presiona Ctrl+C para detener")

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    httpd.serve_forever()