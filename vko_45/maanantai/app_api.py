import http.server
import socketserver
import mysql.connector
import urllib.parse
import json
#from varaajat_html import render_varaajat
#from tilat_html import render_tilat
#from varaukset_html import render_varaukset

PORT = 8000

# Yhteys tietokantaan funktio
def db_yhteys():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password=None,
        database="tilavaraus"
    )
    return connection

# HttpRequests on luokka, joka perii SimpleHTTPRequestHandler joka löytyy Pythonin standardikirjaston http.server-moduulista
# SimpleHTTPRequestHandler tarjoaa metodeja HTTP pyyntöjen käsittelyyn
class HttpRequests(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # GET kaikki varaajat
        if self.path == "/varaajat":
            # 200 vastaus kertoo asiakkaalle että pyyntö onnistui
            self.send_response(200)
            # Selaimelle tieto, että data tulee html muodossa
            self.send_header("Content-type", "application/json")
            self.end_headers()

            # Yhteys tietokantaan
            connection = db_yhteys()
            # Cursorin avulla voidaan suorittaa SQL-kyselyitä
            # dictionary=True palauttaa datan dictionarynä jossa on key value pareja
            cursor = connection.cursor(dictionary=True)

            cursor.execute("SELECT * FROM varaajat ORDER BY nimi ASC")
            # Tallennetaan SQL-kyselyn tulokset varaajat muuttujaan
            varaajat = cursor.fetchall()

            cursor.close()
            connection.close()

            # self.wfile.write() lisää sisältöä http vastauksen bodyyn
            # wfile odottaa byte dataa, mutta html on string muodossa, joten encode()
            self.wfile.write(json.dumps(varaajat).encode("utf-8"))

        # GET yksittäinen varaaja
        elif self.path.startswith("/varaajat/"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            
            varaaja_id = int(self.path.split("/")[-1]) # Otetaan id polusta
            print(varaaja_id)
            connection = db_yhteys()
            cursor = connection.cursor(dictionary=True)

            cursor.execute("SELECT * FROM varaajat WHERE id = %s", (varaaja_id,))
            varaaja = cursor.fetchone()

            cursor.close()
            connection.close()

            self.wfile.write(json.dumps(varaaja).encode("utf-8"))

        # GET kaikki tilat
        elif self.path == "/tilat":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            connection = db_yhteys()
            cursor = connection.cursor(dictionary=True)

            cursor.execute("SELECT * FROM tilat ORDER BY tilan_nimi ASC")
            tilat = cursor.fetchall()

            cursor.close()
            connection.close()

            self.wfile.write(json.dumps(tilat).encode("utf-8"))
        
        # GET yksittäinen tila
        elif self.path.startswith("/tilat/"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            
            tila_id = int(self.path.split("/")[-1])
            connection = db_yhteys()
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM tilat WHERE id = %s", (tila_id,))
            tila = cursor.fetchone()

            cursor.close()
            connection.close()

            self.wfile.write(json.dumps(tila).encode("utf-8"))

        # GET kaikki varaukset
        elif self.path == "/varaukset":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            connection = db_yhteys()
            cursor = connection.cursor(dictionary=True)

            cursor.execute(''' SELECT varaukset.id, varaukset.varauspaiva, varaajat.nimi AS varaaja, tilat.tilan_nimi AS tila
                FROM varaukset
                INNER JOIN varaajat ON varaajat.id = varaukset.varaaja
                INNER JOIN tilat ON tilat.id = varaukset.tila
                ORDER BY varauspaiva ASC;
            ''')
            varaukset = cursor.fetchall()

            for varaus in varaukset:
                varaus['varauspaiva'] = varaus['varauspaiva'].isoformat()

            cursor.close()
            connection.close()

            self.wfile.write(json.dumps(varaukset).encode())
        
        # GET yksittäinen varaus
        elif self.path.startswith("/varaukset/"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            
            varaus_id = int(self.path.split("/")[-1])
            connection = db_yhteys()
            cursor = connection.cursor(dictionary=True)

            cursor.execute('''
                SELECT varaukset.id, varaukset.varauspaiva, varaajat.nimi AS varaaja, tilat.tilan_nimi AS tila
                FROM varaukset               
                INNER JOIN varaajat ON varaajat.id = varaukset.varaaja
                INNER JOIN tilat ON tilat.id = varaukset.tila
                WHERE varaukset.id = %s
                ORDER BY varauspaiva ASC;
            ''', (varaus_id,))
            varaus = cursor.fetchone()
            varaus['varauspaiva'] = varaus['varauspaiva'].isoformat()

            cursor.close()
            connection.close()
           
            self.wfile.write(json.dumps(varaus).encode("utf-8"))

        else:
            # Error Not found koodi asiakkaalle, jos polku ei vastaa mitään
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"404 - Not Found")

    def do_POST(self):
        if self.path == "/varaajat":
            # Content-Length kertoo kuinka monta tavua POST pyynnössä on
            content_length = int(self.headers['Content-Length'])
            # rfile virrasta luetaan tavuja content_length määrä
            # sisältö decodataan utf-8 muotoon ja post_data sisältää lopuksi datan merkkijonona
            post_data = self.rfile.read(content_length).decode('utf-8')
            # urllib.parse.parse_qs() muuttaa post_datan sanakirjaksi
            # Haetaan avaimen varaaja_nimi arvo (lista) ja otetaan ensimmäinen arvo
            varaaja_nimi = urllib.parse.parse_qs(post_data)["varaaja_nimi"][0]

            connection = db_yhteys()
            cursor = connection.cursor()
            cursor.execute("INSERT INTO varaajat (nimi) VALUES (%s)", (varaaja_nimi,))
            connection.commit()
            cursor.close()
            connection.close()

            # 303 kertoo että pyyntö on käsitelty ja asiakkaan tulee siirtyä toiseen osoitteeseen
            self.send_response(303)
            # Uudelleenohjataan selain osoitteeseen /varaajat
            self.send_header('Location', '/varaajat')
            self.end_headers()

    '''        elif self.path == "/poista-varaaja":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            varaaja_id = urllib.parse.parse_qs(post_data)["id"][0]

            connection = db_yhteys()
            cursor = connection.cursor()
            cursor.execute("DELETE FROM varaajat WHERE id = %s", (varaaja_id,))
            connection.commit()
            cursor.close()
            connection.close()

            self.send_response(303)
            self.send_header('Location', '/varaajat')
            self.end_headers()'''

    '''        elif self.path == "/lisaa-tila":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            tilan_nimi = urllib.parse.parse_qs(post_data)["tilan_nimi"][0]

            connection = db_yhteys()
            cursor = connection.cursor()
            cursor.execute("INSERT INTO tilat (tilan_nimi) VALUES (%s)", (tilan_nimi,))
            connection.commit()
            cursor.close()
            connection.close()

            self.send_response(303)
            self.send_header('Location', '/tilat')
            self.end_headers()'''

    '''       elif self.path == "/poista-tila":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            tila_id = urllib.parse.parse_qs(post_data)["id"][0]

            connection = db_yhteys()
            cursor = connection.cursor()
            cursor.execute("DELETE FROM tilat WHERE id = %s", (tila_id,))
            connection.commit()
            cursor.close()
            connection.close()

            self.send_response(303)
            self.send_header('Location', '/tilat')
            self.end_headers()'''

    '''        elif self.path == "/lisaa-varaus":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            varauspaiva = urllib.parse.parse_qs(post_data)["varauspaiva"][0]
            varaaja = urllib.parse.parse_qs(post_data)["varaaja"][0]
            tila = urllib.parse.parse_qs(post_data)["tila"][0]

            connection = db_yhteys()
            cursor = connection.cursor()
            cursor.execute(''
                INSERT INTO varaukset (varauspaiva, varaaja, tila) 
                VALUES (%s, %s, %s);
            '', (varauspaiva, varaaja, tila,))
            connection.commit()
            cursor.close()
            connection.close()

            self.send_response(303)
            self.send_header('Location', '/varaukset')
            self.end_headers()

        elif self.path == "/poista-varaus":
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            varaus_id = urllib.parse.parse_qs(post_data)["id"][0]

            connection = db_yhteys()
            cursor = connection.cursor()
            cursor.execute("DELETE FROM varaukset WHERE id = %s", (varaus_id,))
            connection.commit()
            cursor.close()
            connection.close()

            self.send_response(303)
            self.send_header('Location', '/varaukset')
            self.end_headers()
    '''
    def do_DELETE(self):
        if "/varaajat/" in self.path:
            varaaja_id = self.path.split("/")[-1] # Otetaan id polusta
            connection = db_yhteys()
            cursor = connection.cursor()
            cursor.execute("DELETE FROM varaajat WHERE id = %s", (varaaja_id,))
            connection.commit()
            cursor.close()
            connection.close()

            self.send_response(204)
            self.end_headers()

        if "/tilat/" in self.path:
            tila_id = self.path.split("/")[-1]
            connection = db_yhteys()
            cursor = connection.cursor()
            cursor.execute("DELETE FROM tilat WHERE id = %s", (tila_id,))
            connection.commit()
            cursor.close()
            connection.close()

            self.send_response(204)
            self.end_headers()

# Luodaan TCP palvelin, joka kuuntelee saapuvia yhteyksiä
# socketserver.TCPServer on luokka, joka tarjoaa palvelinmallin TCP-yhteyksille. 
# Se ottaa vastaan pyynnöt ja käsittelee ne HttpRequests luokan avulla
# "" tarkoittaa, että palvelin kuuntelee kaikilla IP-osotteilla, PORT kertoo mitä porttia käytetään (8000)
# HttpRequests käsittelee HTTP-pyynnöt
with socketserver.TCPServer(("", PORT), HttpRequests) as httpd:
    print(f"Palvelin käynnistetty portissa {PORT}")
    httpd.serve_forever()