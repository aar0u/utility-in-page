#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

# 使用Azure提供的PORT环境变量，默认8000
port = int(os.environ.get('PORT', 8000))

print(f"Starting server on port {port}...")

class QuietTCPServer(socketserver.TCPServer):
    def handle_error(self, request, client_address):
        if isinstance(sys.exc_info()[1], ConnectionResetError):
            return
        super().handle_error(request, client_address)

with QuietTCPServer(("", port), http.server.SimpleHTTPRequestHandler) as httpd:
    httpd.serve_forever()
