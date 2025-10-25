import http.server
import socketserver
import os

class RedirectHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Si la ruta no es un archivo existente, redirigir a 404.html
        file_path = self.path.lstrip('/')
        if file_path == '':
            file_path = 'index.html'

        if not os.path.exists(file_path):
            self.path = '/404.html'
            self.send_response(404)

        super().do_GET()

PORT = 8000
print(f"Servidor iniciado en http://localhost:{PORT}")
print("Para probar 404, visita: http://localhost:8000/pagina-inexistente")

with socketserver.TCPServer(("", PORT), RedirectHandler) as httpd:
    httpd.serve_forever()