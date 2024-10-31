import sqlite3 
from tabulate import tabulate
import re

conn = sqlite3.connect('tilavaraus.db') 
cursor = conn.cursor() 

# ON DELETE CASCADE ei toimi sqlitellä ilman alla olevaa käskyä
cursor.execute('PRAGMA foreign_keys = ON;')

# Luodaan tablet
cursor.execute(''' CREATE TABLE IF NOT EXISTS varaajat (
        varaaja_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nimi TEXT NOT NULL
    );
''')

cursor.execute(''' CREATE TABLE IF NOT EXISTS tilat (
        tila_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nimi TEXT NOT NULL
    );
''')

cursor.execute(''' CREATE TABLE IF NOT EXISTS varaukset (
	varaus_id INTEGER PRIMARY KEY AUTOINCREMENT,
	varauspaiva DATE NOT NULL,
    varaaja INTEGER NOT NULL,
    tila INTEGER NOT NULL,
    FOREIGN KEY(varaaja) REFERENCES varaajat(varaaja_id) ON DELETE CASCADE,
    FOREIGN KEY(tila) REFERENCES tilat(tila_id) ON DELETE CASCADE
    );
''')

# Varaajiin liittyvät funktiot
def nayta_varaajat():
    cursor.execute('''
        SELECT * FROM varaajat;
    ''')

    rows = cursor.fetchall()

    if rows: 
        print(tabulate(rows, headers=["ID", "Nimi"], tablefmt="grid")) 
    else: 
        print("No rows in table.")
        
def lisaa_varaaja():
    nimi = input("Mikä on varaajan nimi?: ")

    cursor.execute('''
        INSERT INTO varaajat (nimi) VALUES (?);
    ''', (nimi,))

    conn.commit()

def poista_varaaja():
    nayta_varaajat()

    id = int(input("Kirjoita sen varaajan id, jonka haluat poistaa: "))

    cursor.execute('''
        DELETE FROM varaajat WHERE varaaja_id=?;
    ''', (id,))

    conn.commit()

# Tiloihin liittyvät funktiot
def nayta_tilat():
    cursor.execute('''
        SELECT * FROM tilat;
    ''')

    rows = cursor.fetchall()

    if rows: 
        print(tabulate(rows, headers=["ID", "Nimi"], tablefmt="grid")) 
    else: 
        print("No rows in table.") 

def lisaa_tila():
    nimi = input("Mikä on tilan nimi?: ")

    cursor.execute('''
        INSERT INTO tilat (nimi) VALUES (?);
    ''', (nimi,))

    conn.commit()

def poista_tila():
    nayta_tilat()

    id = int(input("Kirjoita sen tilan id, jonka haluat poistaa: "))

    cursor.execute('''
        DELETE FROM tilat WHERE tila_id=?;
    ''', (id,))

    conn.commit()

# Varauksiin liittyvät funktiot
def nayta_varaukset():
    cursor.execute('''
        SELECT varaukset.varaus_id, varaukset.varauspaiva, varaajat.nimi, tilat.nimi
        FROM varaukset
        INNER JOIN varaajat ON varaukset.varaaja = varaajat.varaaja_id
        INNER JOIN tilat ON varaukset.tila = tilat.tila_id;
    ''')

    rows = cursor.fetchall()

    if rows: 
        print(tabulate(rows, headers=["ID", "Varauspäivä", "Varaaja", "Tila"], tablefmt="grid")) 
    else: 
        print("No rows in table.")

def lisaa_varaus():
    while True:
        varauspaiva = input("Mikä on varauksen päivä? (YYYY-MM-DD): ")
        regex = r'^([2-9][0-9]{3})-([0][1-9]|[1][0-2])-([0][1-9]|[1-2][0-9]|[3][0-1])$'

        is_valid = re.search(regex, varauspaiva)

        if is_valid:
            nayta_varaajat()
            varaaja = int(input("Mikä on varaajan id?: "))
            nayta_tilat()
            tila = int(input("Mikä on tilan id?: "))

            cursor.execute('''
                INSERT INTO varaukset (varauspaiva, varaaja, tila) 
                VALUES (?, ?, ?);
            ''', (varauspaiva, varaaja, tila,))

            conn.commit()
            break
        else:
            print("Syötteesi ei vastannut tarvittua muotoa. Yritä uudelleen.")
            continue

def poista_varaus():
    nayta_varaukset()

    id = int(input("Kirjoita sen varauksen id, jonka haluat poistaa: "))

    cursor.execute('''
        DELETE FROM varaukset WHERE varaus_id=?;
    ''', (id,))

    conn.commit()


def main():
    print("Tervetuloa tilavaraukseen!")

    while True:    
        print("""Tilavarauksessa voit
            1: nähdä kaikki varaajat
            2: lisätä uuden varaajan
            3: poistaa varaajan
            4: nähdä kaikki tilat
            5: lisätä uuden tilan
            6: poistaa tilan
            7: nähdä kaikki varaukset
            8: lisätä uuden varauksen
            9: poistaa varauksen
            10: poistu""")

        # Varmistetaan, että syötteenä voi antaa vain integerejä
        try:
            toiminto = int(input("Kirjoita haluamaasi toimintoa vastaava numero tähän: "))
        except ValueError:
            print("You need to type an integer 1-10.")
            continue

        if toiminto == 1:
            nayta_varaajat()
        elif toiminto == 2:
            lisaa_varaaja()
        elif toiminto == 3:
            poista_varaaja()
        elif toiminto == 4:
            nayta_tilat()
        elif toiminto == 5:
            lisaa_tila()
        elif toiminto == 6:
            poista_tila()
        elif toiminto == 7:
            nayta_varaukset()
        elif toiminto == 8:
            lisaa_varaus()
        elif toiminto == 9:
            poista_varaus()
        elif toiminto == 10:
            print("Kiitos ja tervetuloa uudestaan!")
            break
        else:
            print("Syötteesi ei vastannut yhtäkään toimintoa. Yritä uudelleen.")

main()