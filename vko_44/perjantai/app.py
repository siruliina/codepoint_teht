from flask import Flask, render_template, request, redirect, url_for
import mysql.connector

def db_yhteys():
    connection = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = None,
        database = "tilavaraus"
    )
    return connection

app = Flask(__name__)

@app.route("/")
def index():    
    return render_template("index.html")

@app.route("/varaajat")
def nayta_varaajat():
    connection = db_yhteys()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM varaajat ORDER BY nimi ASC;")
    varaajat = cursor.fetchall()

    cursor.close()
    connection.close()

    return render_template("varaajat.html", varaajat=varaajat)

@app.route("/lisaa-varaaja", methods=["POST"])
def lisaa_varaaja():
    nimi = request.form["nimi"]

    connection = db_yhteys()
    cursor = connection.cursor()

    cursor.execute("INSERT INTO varaajat (nimi) VALUES (%s);", (nimi,))
    connection.commit()

    cursor.close()
    connection.close()

    return redirect(url_for("nayta_varaajat"))

@app.route("/poista-varaaja", methods=["POST"])
def poista_varaaja():
    varaaja_id = request.form["id"]

    connection = db_yhteys()
    cursor = connection.cursor()

    cursor.execute(''' DELETE FROM varaajat WHERE id=%s ''', (varaaja_id,))
    connection.commit()

    cursor.close()
    connection.close()

    return redirect(url_for("nayta_varaajat"))

@app.route("/tilat")
def nayta_tilat():
    connection = db_yhteys()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM tilat ORDER BY tilan_nimi ASC;")
    tilat = cursor.fetchall()
    print(tilat)

    cursor.close()
    connection.close()

    return render_template("tilat.html", tilat=tilat)

@app.route("/lisaa-tila", methods=["POST"])
def lisaa_tila():
    tilan_nimi = request.form["tilan_nimi"]

    connection = db_yhteys()
    cursor = connection.cursor()

    cursor.execute("INSERT INTO tilat (tilan_nimi) VALUES (%s);", (tilan_nimi,))
    connection.commit()

    cursor.close()
    connection.close()

    return redirect(url_for("nayta_tilat"))

@app.route("/poista-tila", methods=["POST"])
def poista_tila():
    tila_id = request.form["id"]

    connection = db_yhteys()
    cursor = connection.cursor()

    cursor.execute(''' DELETE FROM tilat WHERE id=%s ''', (tila_id,))
    connection.commit()

    cursor.close()
    connection.close()

    return redirect(url_for("nayta_tilat"))

@app.route("/varaukset")
def nayta_varaukset():
    connection = db_yhteys()
    cursor = connection.cursor(dictionary=True)

    cursor.execute('''
        SELECT varaukset.id, varaukset.varauspaiva, varaajat.nimi, tilat.tilan_nimi
        FROM varaukset
        INNER JOIN varaajat ON varaukset.varaaja=varaajat.id
        INNER JOIN tilat ON varaukset.tila=tilat.id
        ORDER BY varaukset.varauspaiva ASC;
    ''')
    varaukset = cursor.fetchall()

    cursor.execute("SELECT * FROM tilat ORDER BY tilan_nimi ASC;")
    tilat = cursor.fetchall()

    cursor.execute("SELECT * FROM varaajat ORDER BY nimi ASC;")
    varaajat = cursor.fetchall()

    cursor.close()
    connection.close()

    return render_template("varaukset.html", varaukset=varaukset, tilat=tilat, varaajat=varaajat)

@app.route("/lisaa-varaus", methods=["POST"])
def lisaa_varaus():
    varauspaiva = request.form["varauspaiva"]
    varaaja = request.form["varaaja"]
    tila = request.form["tila"]

    connection = db_yhteys()
    cursor = connection.cursor()

    cursor.execute('''
        INSERT INTO varaukset (varauspaiva, varaaja, tila)
        VALUES (%s, %s, %s);
    ''', (varauspaiva, varaaja, tila,))
    connection.commit()

    cursor.close()
    connection.close()

    return redirect(url_for("nayta_varaukset"))

@app.route("/poista-varaus", methods=["POST"])
def poista_varaus():
    varaus_id = request.form["id"]

    connection = db_yhteys()
    cursor = connection.cursor()

    cursor.execute(''' DELETE FROM varaukset WHERE id=%s ''', (varaus_id,))
    connection.commit()

    cursor.close()
    connection.close()

    return redirect(url_for("nayta_varaukset"))

app.run()