#!/usr/bin/env python3
import http.server
import socketserver
import os

# 使用Azure提供的PORT环境变量，默认8000
port = int(os.environ.get('PORT', 8000))

print(f"Starting server on port {port}...")

with socketserver.TCPServer(("", port), http.server.SimpleHTTPRequestHandler) as httpd:
    httpd.serve_forever()
