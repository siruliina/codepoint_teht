from http.server import *
import mysql.connector
import urllib.parse
import json
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

# HttpRequests on luokka, joka perii SimpleHTTPRequestHandler joka löytyy Pythonin standardikirjaston http.server-moduulista
# SimpleHTTPRequestHandler tarjoaa metodeja HTTP pyyntöjen käsittelyyn
class HttpRequests(SimpleHTTPRequestHandler):

    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, X-API-Key, Content-Type')
        self.send_header('Access-Control-Allow-Credentials', 'true')

    def do_OPTIONS(self):
        # Käsitellään preflight-OPTIONS-pyyntö
        self.send_response(200)
        self._send_cors_headers()      
        self.end_headers()
        print("options loppu")

    def do_GET(self):
        cookies = self.parse_cookies(self.headers.get("Cookie"))
        print(cookies)
        if "sid" in cookies:
            self.user = cookies["sid"] if (cookies["sid"] in sessions) else False
        else:
            self.user = False

        connection = db_yhteys()
        cursor = connection.cursor(dictionary=True)

        # GET kaikki varaajat
        if self.path == "/varaajat":
            if self.user:
                # 200 vastaus kertoo asiakkaalle että pyyntö onnistui
                self.send_response(200)
                self._send_cors_headers()
                self.end_headers()

                cursor.execute("SELECT * FROM varaajat ORDER BY nimi ASC")
                # Tallennetaan SQL-kyselyn tulokset varaajat muuttujaan
                varaajat = cursor.fetchall()

                # self.wfile.write() lisää sisältöä http vastauksen bodyyn
                # wfile odottaa byte dataa, mutta html on string muodossa, joten encode()
                self.wfile.write(json.dumps(varaajat).encode("utf-8"))
            else:
                self.send_response(401)  
                self.end_headers()
                self.wfile.write(b"Unauthorized")

        # GET yksittäinen varaaja
        elif self.path.startswith("/varaajat/"):
            if self.user:
                self.send_response(200)
                self._send_cors_headers()
                self.end_headers()
                
                varaaja_id = int(self.path.split("/")[-1]) # Otetaan id polusta
                print(varaaja_id)

                cursor.execute("SELECT * FROM varaajat WHERE id = %s", (varaaja_id,))
                varaaja = cursor.fetchone()

                self.wfile.write(json.dumps(varaaja).encode("utf-8"))
            else:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Unauthorized")

        # GET kaikki tilat
        elif self.path == "/tilat":
            if self.user:
                self.send_response(200)
                self._send_cors_headers()
                self.end_headers()

                cursor.execute("SELECT * FROM tilat ORDER BY tilan_nimi ASC")
                tilat = cursor.fetchall()

                self.wfile.write(json.dumps(tilat).encode("utf-8"))
            else:
                self.send_response(401) 
                self.end_headers()
                self.wfile.write(b"Unauthorized")
        
        # GET yksittäinen tila
        elif self.path.startswith("/tilat/"):
            if self.user:
                self.send_response(200)
                self._send_cors_headers()
                self.end_headers()
                
                tila_id = int(self.path.split("/")[-1])
                cursor.execute("SELECT * FROM tilat WHERE id = %s", (tila_id,))
                tila = cursor.fetchone()

                self.wfile.write(json.dumps(tila).encode("utf-8"))
            else:
                self.send_response(401)   
                self.end_headers()
                self.wfile.write(b"Unauthorized")

        # GET kaikki varaukset
        elif self.path == "/varaukset":
            if self.user:
                self.send_response(200)
                self._send_cors_headers()
                self.end_headers()

                cursor.execute(''' SELECT varaukset.id, varaukset.varauspaiva, varaajat.nimi AS varaaja, tilat.tilan_nimi AS tila
                    FROM varaukset
                    INNER JOIN varaajat ON varaajat.id = varaukset.varaaja
                    INNER JOIN tilat ON tilat.id = varaukset.tila
                    ORDER BY varauspaiva ASC;
                ''')
                varaukset = cursor.fetchall()

                for varaus in varaukset:
                    varaus['varauspaiva'] = varaus['varauspaiva'].isoformat()

                self.wfile.write(json.dumps(varaukset).encode())
            else:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Unauthorized")
        
        # GET yksittäinen varaus
        elif self.path.startswith("/varaukset/"):
            if self.user:
                self.send_response(200)
                self._send_cors_headers()
                self.end_headers()
                
                varaus_id = int(self.path.split("/")[-1])

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
            
                self.wfile.write(json.dumps(varaus).encode("utf-8"))
            else:
                self.send_response(401)   
                self.end_headers()
                self.wfile.write(b"Unauthorized")

        else:
            # Error Not found koodi asiakkaalle, jos polku ei vastaa mitään
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"404 - Not Found")

        cursor.close()
        connection.close()

    def do_POST(self):
        print("päästiin POSTIIN")
        cookies = self.parse_cookies(self.headers.get("Cookie"))
        print(cookies)
        if "sid" in cookies:
            self.user = cookies["sid"] if (cookies["sid"] in sessions) else False
        else:
            self.user = False

        connection = db_yhteys()
        print(connection)
        cursor = connection.cursor(dictionary=True)
            
        # Kirjautuminen
        if self.path == "/login":
            print("id path login")
            if not self.user:                
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length).decode('utf-8')
                login_data = json.loads(post_data)

                nimi = login_data.get("nimi")
                salasana = login_data.get("salasana")

                cursor.execute("SELECT * FROM kayttajat WHERE nimi = %s AND salasana = %s", (nimi, salasana,))
                user = cursor.fetchone()

                if user:
                    sid = self.generate_sid()
                    sessions[sid] = {"username": nimi}
                    self.send_response(200)
                    self._send_cors_headers()
                    self.send_header("Set-Cookie", f"sid={sid}; SameSite=None; Secure")
                    self.end_headers()
                    self.wfile.write(b"Logged In")
                else:
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b"Unauthorized")
            else:
                self.send_response(401) 
                self.end_headers()
                self.wfile.write(b"Already logged in")

        # Uuden varaajan lisäys
        elif self.path == "/varaajat":
            if self.user:
                # Content-Length kertoo kuinka monta tavua POST pyynnössä on
                content_length = int(self.headers['Content-Length'])
                # rfile virrasta luetaan tavuja content_length määrä
                # sisältö decodataan utf-8 muotoon ja post_data sisältää lopuksi datan merkkijonona
                post_data = self.rfile.read(content_length).decode('utf-8')
                # urllib.parse.parse_qs() muuttaa post_datan sanakirjaksi
                # Haetaan avaimen varaaja_nimi arvo (lista) ja otetaan ensimmäinen arvo
                varaaja_data = json.loads(post_data)
                varaaja_nimi = varaaja_data.get("nimi")

                cursor.execute("INSERT INTO varaajat (nimi) VALUES (%s)", (varaaja_nimi,))
                connection.commit()
                
                self.send_response(201)
                self._send_cors_headers()
                self.end_headers()
                
                uusi_varaaja = {
                    "id": cursor.lastrowid,
                    "nimi": varaaja_nimi
                }

                self.wfile.write(json.dumps(uusi_varaaja).encode("utf-8"))

            else:
                self.send_response(401)   
                self.end_headers()
                self.wfile.write(b"Unauthorized")

        # Uuden tilan lisäys
        elif self.path == "/tilat":
            if self.user:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length).decode('utf-8')
                tila_data = json.loads(post_data)
                tilan_nimi = tila_data.get("tilan_nimi")

                cursor.execute("INSERT INTO tilat (tilan_nimi) VALUES (%s)", (tilan_nimi,))
                connection.commit()

                self.send_response(201)
                self._send_cors_headers()
                self.end_headers()
                
                uusi_tila = {
                    "id": cursor.lastrowid,
                    "tilan_nimi": tilan_nimi
                }
                
                self.wfile.write(json.dumps(uusi_tila).encode("utf-8"))

            else:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Unauthorized")

        # Uuden varauksen lisäys
        elif self.path == "/varaukset":
            if self.user:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length).decode('utf-8')
                varaus_data = json.loads(post_data)
                varauspaiva = varaus_data.get("varauspaiva")
                tila = varaus_data.get("tila")
                varaaja = varaus_data.get("varaaja")

                cursor.execute('''
                    INSERT INTO varaukset (varauspaiva, varaaja, tila) 
                    VALUES (%s, %s, %s);
                ''', (varauspaiva, varaaja, tila,))

                connection.commit()
                
                self.send_response(201)
                self._send_cors_headers()
                self.end_headers()

                uusi_varaus = {
                    "id": cursor.lastrowid,
                    "varauspaiva": varauspaiva,
                    "varaaja": varaaja,
                    "tila": tila
                }
                self.wfile.write(json.dumps(uusi_varaus).encode("utf-8"))

            else:
                self.send_response(401)     
                self.end_headers()
                self.wfile.write(b"Unauthorized")  

        cursor.close()
        connection.close()       

    def do_DELETE(self):
        cookies = self.parse_cookies(self.headers.get("Cookie"))
        if "sid" in cookies:
            self.user = cookies["sid"] if (cookies["sid"] in sessions) else False
            print(self.user)
        else:
            self.user = False
        
        connection = db_yhteys()
        cursor = connection.cursor(dictionary=True)

        # Ulos kirjautuminen
        if "/logout" in self.path:
            if not self.user:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"Not logged in")
            else:
                del sessions[self.user]
                self.send_response(200)
                self._send_cors_headers()
                self.send_header("Set-Cookie", "sid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure")
                self.end_headers()
                self.wfile.write(b"Logged Out")

        # Varaajan poistaminen
        elif "/varaajat/" in self.path:
            if self.user:
                varaaja_id = int(self.path.split("/")[-1]) # Otetaan id polusta
                cursor.execute("DELETE FROM varaajat WHERE id = %s", (varaaja_id,))
                connection.commit()

                self.send_response(204)
                self._send_cors_headers()
                self.end_headers()
            else:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Unauthorized")

        # Tilan poistaminen
        elif "/tilat/" in self.path:
            if self.user:
                tila_id = int(self.path.split("/")[-1])
                cursor.execute("DELETE FROM tilat WHERE id = %s", (tila_id,))
                connection.commit()

                self.send_response(204)
                self._send_cors_headers()
                self.end_headers()
            else:
                self.send_response(401) 
                self.end_headers()
                self.wfile.write(b"Unauthorized")
        
        # Varauksen poistaminen
        elif "/varaukset/" in self.path:
            if self.user:
                varaus_id = int(self.path.split("/")[-1])
                cursor.execute("DELETE FROM varaukset WHERE id = %s", (varaus_id,))
                connection.commit()

                self.send_response(204)
                self._send_cors_headers()
                self.end_headers()
            else:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Unauthorized")
    
        cursor.close()
        connection.close()

    # Apumetodi istunto-ID:n luomiseen
    def generate_sid(self):
        return "".join(str(randint(1,9)) for _ in range(30))

    # Apumetodi evästeiden käsittelyyn
    def parse_cookies(self, cookie_list):
        return dict((c.split("=") for c in cookie_list.split(";"))) \
        if cookie_list else {}

# Luodaan palvelin, joka kuuntelee saapuvia yhteyksiä
# Se ottaa vastaan pyynnöt ja käsittelee ne HttpRequests luokan avulla
# "" tarkoittaa, että palvelin kuuntelee kaikilla IP-osotteilla, 8000 porttia käytetään
address = ("", 8000)
server = ThreadingHTTPServer(address, HttpRequests)
print("Hosting server on port 8000")
server.serve_forever()