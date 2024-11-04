def render_varaukset(varaukset, varaajat, tilat):
    html = '''
    <!DOCTYPE html>
    <html lang="fi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Varaukset</title>
    </head>
    <body>
        <header>
            <nav>
                <a href="/varaajat">Varaajat</a>
                <a href="/tilat">Tilat</a>
                <a href="/varaukset">Varaukset</a>
            </nav>
            <h1>Tilanvarausjärjestelmä</h1>
        </header>
        
        <h2>Varaukset</h2>

        <section>
            <h3>Lisää varaus</h3>
            <form action="/lisaa-varaus" method="POST">
                <label for="varauspaiva">Varauspäivä</label>
                <input type="date" name="varauspaiva" id="varauspaiva" />

                <label for="varaaja">Varaaja</label>
                <select name="varaaja" id="varaaja">
                    <option value="" disabled selected>Valitse varaaja</option>
    '''

    for varaaja in varaajat:
        html += f'''
                <option value="{ varaaja['id'] }">{ varaaja["nimi"] }</option>
    '''

    html += f'''
            </select>

        <label for="tila">Tila</label>
        <select name="tila" id="tila">
            <option value="" disabled selected>Valitse tila</option>
    '''

    for tila in tilat:
        html += f'''              
            <option value="{ tila['id'] }">{ tila["tilan_nimi"] }</option>
        '''
    
    html += f'''
        </select>

            <input type="submit" value="Lisää varaus" />
        </form>
    </section>
    
    <section>
        <h3>Kaikki varaukset</h3>
        <table>
            <tr>
                <th>ID</th>
                <th>Varauspäivä</th>
                <th>Varaaja</th>
                <th>Tila</th>
                <th></th>
            </tr>
    '''
    for varaus in varaukset:
        html += f'''
            <tr>
                <td>{varaus['id']}</td>
                <td>{varaus['varauspaiva']}</td>
                <td>{varaus['nimi']}</td>
                <td>{varaus['tilan_nimi']}</td>
                <td>
                    <form action="/poista-varaus" method="POST" style="display: inline;">
                        <input type="hidden" name="id" value="{varaus['id']}">
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