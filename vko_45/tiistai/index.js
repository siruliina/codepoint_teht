// Varaajat
function getVaraajat() {
    axios('http://localhost:8000/varaajat')
        .then(response => {
            console.log(response)
            createVaraajaTable(response.data)
            createVaraajaDropdown(response.data)
        })
}

function createVaraajaTable(varaajat) {
    const varaaja_table = document.querySelector('#varaaja-table tbody')

    if (varaaja_table) {
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
}

function createVaraajaDropdown(varaajat) {
    const varaajat_dropdown = document.getElementById('varaajat-dropdown')

    if (varaajat_dropdown) {
        varaajat_dropdown.innerHTML = ''

        for (let varaaja of varaajat) {
            const option = document.createElement('option')
            option.value = varaaja.id
            option.textContent = varaaja.nimi
            varaajat_dropdown.appendChild(option)
        }
    }
}

function addVaraaja(event) {
    event.preventDefault()

    const nimi = document.querySelector('#varaaja-form #nimi').value

    const varaaja = {
        nimi: nimi
    }

    axios.post('http://localhost:8000/varaajat', varaaja)
    .then((response) => {
        console.log(response.data)
    })

    return false
}

// Tilat
function getTilat() {
    axios('http://localhost:8000/tilat')
        .then(response => {
            console.log(response)
            createTilaTable(response.data)
            createTilaDropdown(response.data)
        })
}

function createTilaTable(tilat) {
    const tila_table = document.querySelector('#tila-table tbody')
    
    if (tila_table) {
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
}

function createTilaDropdown(tilat) {
    const tilat_dropdown = document.getElementById('tilat-dropdown')

    if (tilat_dropdown) {
        tilat_dropdown.innerHTML = ''

        for (let tila of tilat) {
            const option = document.createElement('option')
            option.value = tila.id
            option.textContent = tila.tilan_nimi
            tilat_dropdown.appendChild(option)
        }
    }
}

function addTila(event) {
    event.preventDefault()

    const tilan_nimi = document.querySelector('#tila-form #tilan_nimi').value
    
    const tila = {
        tilan_nimi: tilan_nimi
    }

    axios.post('http://localhost:8000/tilat', tila)
        .then((response) => {
            console.log(response.data)
        })
    
    return false
}

// Varaukset
function getVaraukset() {
    axios('http://localhost:8000/varaukset')
        .then(response => {
            console.log(response)
            createVarausTable(response.data)
        })
}

function createVarausTable(varaukset) {
    const varaus_table = document.querySelector('#varaus-table tbody')   

    if (varaus_table) {
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
}

function addVaraus(event) {
    event.preventDefault()

    const varauspaiva = document.querySelector('#varaus-form #varauspaiva').value
    const varaaja = document.querySelector('#varaus-form #varaajat-dropdown').value
    const tila = document.querySelector('#varaus-form #tilat-dropdown').value

    const varaus = {
        varauspaiva: varauspaiva,
        varaaja: varaaja,
        tila: tila
    }

    axios.post('http://localhost:8000/varaukset', varaus)
        .then((response) => {
            console.log(response.data)
        })
    
    return false
}

document.addEventListener('DOMContentLoaded', function() {
    getVaraajat()
    getTilat()
    getVaraukset()
})
