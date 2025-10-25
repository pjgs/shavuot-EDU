#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Obtener la ruta solicitada
        path = self.path.lstrip('/')

        # Si es la raíz o está vacía, servir index.html
        if not path or path == '':
            self.path = '/index.html'
            return super().do_GET()

        # Construir la ruta completa del archivo
        file_path = os.path.join(os.getcwd(), path)

        # Si el archivo existe, servirlo
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return super().do_GET()

        # Si es un directorio, intentar servir index.html dentro de él
        if os.path.exists(file_path) and os.path.isdir(file_path):
            index_path = os.path.join(file_path, 'index.html')
            if os.path.exists(index_path):
                self.path = path + '/index.html' if path else 'index.html'
                return super().do_GET()

        # Si no existe nada, servir 404.html
        if os.path.exists('404.html'):
            self.path = '/404.html'
            self.send_response(404)
            return super().do_GET()
        else:
            self.send_error(404)

if __name__ == '__main__':
    PORT = 8000
    with socketserver.TCPServer(('', PORT), CustomHTTPRequestHandler) as httpd:
        print(f'Servidor corriendo en http://localhost:{PORT}')
        print('Presiona Ctrl+C para detener el servidor')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nServidor detenido')
            sys.exit(0)