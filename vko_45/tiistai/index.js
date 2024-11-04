/*function getData() {
    axios('http://data.foli.fi/siri/sm/672')
        .then(d=>createList(d.data.result))
}

function createList(stops) {
    const listEl = document.getElementById('stops-list')
    for (let stop of stops) {
        const el = document.createElement('li')
        const departureTime = new Date(parseInt(stop.expecteddeparturetime) * 1000 )
        const text = stop.lineref + ' ' + stop.destinationdisplay + ' ' + departureTime.toLocaleTimeString()
        el.innerHTML = text
        listEl.append(el)
    }
}
*/
function getVaraajat() {
    axios('http://localhost:8000/varaajat')
        .then(response => {
            console.log(response)
            createVaraajaTable(response.data)
        })
}

function createVaraajaTable(varaajat) {
    const varaaja_table = document.querySelector('#varaaja-table tbody')
    varaaja_table.innerHTML = ''

    for (let varaaja of varaajat) {
        const row = document.createElement('tr')
        
        const id_cell = document.createElement('td')
        id_cell.innerHTML = varaaja.id
        row.appendChild(id_cell)

        const nimi_cell = document.createElement('td')
        nimi_cell.innerHTML = varaaja.nimi
        row.appendChild(nimi_cell)

        varaaja_table.appendChild(row)
    }
}

function getTilat() {
    axios('http://localhost:8000/tilat')
        .then(response => {
            console.log(response)
            createTilaTable(response.data)
        })
}

function createTilaTable(tilat) {
    const tila_table = document.querySelector('#tila-table tbody')
    tila_table.innerHTML = ''

    for (let tila of tilat) {
        const row = document.createElement('tr')

        const id_cell = document.createElement('td')
        id_cell.textContent = tila.id
        row.appendChild(id_cell)

        const nimi_cell = document.createElement('td')
        nimi_cell.textContent = tila.tilan_nimi
        row.appendChild(nimi_cell)

        tila_table.appendChild(row)
    }
}

function getVaraukset() {
    axios('http://localhost:8000/varaukset')
        .then(response => {
            console.log(response)
            createVarausTable(response.data)
        })
}

function createVarausTable(varaukset) {
    const varaus_table = document.querySelector('#varaus-table tbody')
    varaus_table.innerHTML = ''

    for (let varaus of varaukset) {
        const row = document.createElement('tr')
        
        id_cell = document.createElement('td')
        id_cell.textContent = varaus.id
        row.appendChild(id_cell)

        varauspaiva_cell = document.createElement('td')
        varauspaiva_cell.textContent = varaus.varauspaiva
        row.appendChild(varauspaiva_cell)

        varaaja_cell = document.createElement('td')
        varaaja_cell.textContent = varaus.varaaja
        row.appendChild(varaaja_cell)

        tila_cell = document.createElement('td')
        tila_cell.textContent = varaus.tila
        row.appendChild(tila_cell)

        varaus_table.appendChild(row)
    }

    
}