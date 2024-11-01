import http.server
import socketserver
import mysql.connector
import urllib.parse
import json

PORT = 8000

# MySQL-yhteysfunktio
def db_yhteys():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",  # Aseta salasana, jos olet määrittänyt sen
        database="tilavaraus"
    )
    return connection

# HTML-näkymä varaajien näyttämiseen
def render_varaajat(varaajat):
    html = '''
    <!DOCTYPE html>
    <html lang="fi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Varaajat</title>
    </head>
    <body>
        <h1>Tilanvarausjärjestelmä</h1>
        
        <h2>Varaajat</h2>

        <section>
            <h3>Lisää varaaja</h3>
            <form action="/lisaa-varaaja" method="POST">
                <input type="text" name="varaaja_nimi" placeholder="Nimi" required>
                <input type="submit" value="Lisää">
            </form>
        </section>
        
        <section>
            <h3>Kaikki varaajat</h3>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Nimi</th>
                    <th>Toiminnot</th>
                </tr>
    '''
    for varaaja in varaajat:
        html += f'''
            <tr>
                <td>{varaaja['id']}</td>
                <td>{varaaja['nimi']}</td>
                <td>
                    <form action="/poista-varaaja" method="POST" style="display:inline;">
                        <input type="hidden" name="id" value="{varaaja['id']}">
                        <input type="submit" value="Poista">
                    </form>
                </td>
            </tr>
    '''
        
    html += '''
            </table>
            </section>       
        </body>
        </html>
    '''
    return html

# HTTP-käsittelijä
class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/varaajat":
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()

            # Hae varaajat tietokannasta
            connection = db_yhteys()
            cursor = connection.cursor(dictionary=True)

            cursor.execute("SELECT * FROM varaajat")
            varaajat = cursor.fetchall()

            cursor.close()
            connection.close()

            # Renderöi HTML-vastaus
            self.wfile.write(render_varaajat(varaajat).encode())

        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"404 - Not Found")

    def do_POST(self):
        if self.path == "/lisaa-varaaja":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            varaaja_nimi = urllib.parse.parse_qs(post_data)["varaaja_nimi"][0]

            # Lisää uusi varaaja tietokantaan
            connection = db_yhteys()
            cursor = connection.cursor()
            cursor.execute("INSERT INTO varaajat (nimi) VALUES (%s)", (varaaja_nimi,))
            connection.commit()
            cursor.close()
            connection.close()

            self.send_response(303)  # Redirect
            self.send_header('Location', '/varaajat')
            self.end_headers()

        elif self.path == "/poista-varaaja":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            varaaja_id = urllib.parse.parse_qs(post_data)["id"][0]

            # Poista varaaja tietokannasta
            connection = db_yhteys()
            cursor = connection.cursor()
            cursor.execute("DELETE FROM varaajat WHERE id = %s", (varaaja_id,))
            connection.commit()
            cursor.close()
            connection.close()

            self.send_response(303)  # Redirect
            self.send_header('Location', '/varaajat')
            self.end_headers()

# Luo ja käynnistä palvelin
with socketserver.TCPServer(("", PORT), MyHttpRequestHandler) as httpd:
    print(f"Palvelin käynnistetty portissa {PORT}")
    httpd.serve_forever()
