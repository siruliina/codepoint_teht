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
        <header>
            <nav>
                <a href="/varaajat">Varaajat</a>
                <a href="/tilat">Tilat</a>
                <a href="/varaukset">Varaukset</a>
            </nav>
            <h1>Tilanvarausjärjestelmä</h1>
        </header>
        
        <h2>Varaajat</h2>

        <section>
            <h3>Lisää varaaja</h3>
            <form action="/lisaa-varaaja" method="POST">
                <label for="varaaja_nimi">Nimi</label>
                <input type="text" name="varaaja_nimi" id="varaaja_nimi" placeholder="Nimi" required>
                <input type="submit" value="Lisää">
            </form>
        </section>
        
        <section>
            <h3>Kaikki varaajat</h3>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Nimi</th>
                    <th></th>
                </tr>
    '''
    for varaaja in varaajat:
        html += f'''
            <tr>
                <td>{varaaja['id']}</td>
                <td>{varaaja['nimi']}</td>
                <td>
                    <form action="/poista-varaaja" method="POST" style="display: inline;">
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