from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import mysql.connector
import urllib.parse
from random import randint

sessions = {}

# Yhteys tietokantaan funktio
def db_yhteys():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password=None,
        database="tilavaraus"
    )
    return connection

""" The HTTP request handler """
class RequestHandler(BaseHTTPRequestHandler):

    def _send_cors_headers(self):
        """ Sets headers required for CORS """
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE")
        self.send_header("Access-Control-Allow-Headers", "x-api-key,Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_POST(self):
        self.send_response(200)
        self._send_cors_headers()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
            
        # Kirjautuminen
        if self.path == "/login":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            login_data = json.loads(post_data)

            nimi = login_data.get("nimi")
            salasana = login_data.get("salasana")

            connection = db_yhteys()
            cursor = connection.cursor()
            cursor.execute("SELECT * FROM kayttajat WHERE nimi = %s AND salasana = %s", (nimi, salasana,))
            user = cursor.fetchone()
            cursor.close()
            connection.close()

            if user:
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"Logged In")
            else:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Unauthorized")

    def do_DELETE(self):
        cookies = self.parse_cookies(self.headers.get("Cookie"))
        if "sid" in cookies:
            self.user = cookies["sid"] if (cookies["sid"] in sessions) else False
        else:
            self.user = False

        # Ulos kirjautuminen
        if "/logout" in self.path:
            if not self.user:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"Not logged in")
            else:
                del sessions[self.user]
                self.send_response(200)
                self.send_header("Set-Cookie", "sid=; expires=Thu, 01 Jan 1970 00:00:00 GMT")
                self.end_headers()
                self.wfile.write(b"Logged Out")

print("Starting server")
httpd = HTTPServer(("localhost", 8000), RequestHandler)
print("Hosting server on port 8000")
httpd.serve_forever()