def render_tilat(tilat):
    html = '''
    <!DOCTYPE html>
    <html lang="fi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tilat</title>
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
        
        <h2>Tilat</h2>

        <section>
            <h3>Lisää tila</h3>
            <form action="/lisaa-tila" method="POST">
                <label for="tilan_nimi">Nimi</label>
                <input type="text" name="tilan_nimi" id="tilan_nimi" placeholder="Nimi" required>
                <input type="submit" value="Lisää">
            </form>
        </section>
        
        <section>
            <h3>Kaikki tilat</h3>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Nimi</th>
                    <th></th>
                </tr>
    '''
    for tila in tilat:
        html += f'''
            <tr>
                <td>{tila['id']}</td>
                <td>{tila['tilan_nimi']}</td>
                <td>
                    <form action="/poista-tila" method="POST" style="display: inline;">
                        <input type="hidden" name="id" value="{tila['id']}">
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