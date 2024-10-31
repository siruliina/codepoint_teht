import sqlite3 
from tabulate import tabulate 

conn = sqlite3.connect('tilavaraus.db') 
cursor = conn.cursor() 

# ON DELETE CASCADE ei toimi sqlitellä ilman alla olevaa käskyä
cursor.execute('PRAGMA foreign_keys = ON;')

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

# Varaajat
def nayta_varaajat():
    cursor.execute('''
        SELECT * FROM varaajat;
    ''')

    rows = cursor.fetchall()

    if rows: 
        print(tabulate(rows, headers=["ID", "Nimi"], tablefmt="grid")) 
    else: 
        print("No rows in table.")
        
def lisaa_varaaja(nimi):
    cursor.execute('''
        INSERT INTO varaajat (nimi) VALUES (?);
    ''', (nimi,))

    conn.commit()

def poista_varaaja(id):
    cursor.execute('''
        DELETE FROM varaajat WHERE varaaja_id=?;
    ''', (id,))

    conn.commit()

# Tilat
def nayta_tilat():
    cursor.execute('''
        SELECT * FROM tilat;
    ''')

    rows = cursor.fetchall()

    if rows: 
        print(tabulate(rows, headers=["ID", "Nimi"], tablefmt="grid")) 
    else: 
        print("No rows in table.") 

def lisaa_tila(nimi):
    cursor.execute('''
        INSERT INTO tilat (nimi) VALUES (?);
    ''', (nimi,))

    conn.commit()

def poista_tila(id):
    cursor.execute('''
        DELETE FROM tilat WHERE tila_id=?;
    ''', (id,))

    conn.commit()

# Varaukset
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

def lisaa_varaus(varauspaiva, varaaja, tila):
    cursor.execute('''
        INSERT INTO varaukset (varauspaiva, varaaja, tila) 
        VALUES (?, ?, ?);
    ''', (varauspaiva, varaaja, tila,))

    conn.commit() 

def poista_varaus(id):
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

        try:
            toiminto = int(input("Kirjoita haluamaasi toimintoa vastaava numero tähän: "))
        except ValueError:
            print("You need to type an integer 1-10.")
            continue

        if toiminto == 1:
            nayta_varaajat()
        elif toiminto == 2:
            nimi = input("Mikä on varaajan nimi?: ")
            lisaa_varaaja(nimi)
        elif toiminto == 3:
            id = int(input("Kirjoita sen varaajan id, jonka haluat poistaa: "))
            poista_varaaja(id)
        elif toiminto == 4:
            nayta_tilat()
        elif toiminto == 5:
            nimi = input("Mikä on tilan nimi?: ")
            lisaa_tila(nimi)
        elif toiminto == 6:
            id = int(input("Kirjoita sen tilan id, jonka haluat poistaa: "))
            poista_tila(id)
        elif toiminto == 7:
            nayta_varaukset()
        elif toiminto == 8:
            varauspaiva = input("Mikä on varauksen päivä?: ")
            varaaja_id = int(input("Mikä on varaajan id?: "))
            tila_id = int(input("Mikä on tilan id?: "))
            lisaa_varaus(varauspaiva, varaaja_id, tila_id)
        elif toiminto == 9:
            id = int(input("Kirjoita sen varauksen id, jonka haluat poistaa: "))
            poista_varaus(id)
        elif toiminto == 10:
            print("Kiitos ja tervetuloa uudestaan!")
            break
        else:
            print("Syötteesi ei vastannut yhtäkään toimintoa. Yritä uudelleen.")

main()