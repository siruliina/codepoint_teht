// Varaajat
function getVaraajat() {
    axios.get('http://localhost:8000/varaajat')
        .then(response => {
            console.log('Varaajat:', response.data)
            createVaraajaTable(response.data)
            createVaraajaDropdown(response.data)
        })
        .catch(error => {
            console.error(`Virhe hakiessa varaajia:`, error)
        })
}

function createVaraajaTable(varaajat) {
    const varaaja_table = document.querySelector('#varaaja-table tbody')

    if (varaaja_table) {
        varaaja_table.innerHTML = ''
        for (let varaaja of varaajat) {
            const row = document.createElement('tr')
            
            const id_cell = document.createElement('td')
            id_cell.textContent = varaaja.id
            row.appendChild(id_cell)

            const nimi_cell = document.createElement('td')
            nimi_cell.textContent = varaaja.nimi
            row.appendChild(nimi_cell)

            const delete_cell = document.createElement('td')
            const delete_button = document.createElement('button')
            delete_button.textContent = 'X'
            delete_button.onclick = function() {
                deleteVaraaja(varaaja.id)
            }
            delete_cell.appendChild(delete_button)
            row.appendChild(delete_cell)

            varaaja_table.appendChild(row)
        }
    }
    else {
        console.error('varaaja_table ei löytynyt')
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
    else {
        console.error('varaajat_dropdown ei löytynyt')
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
        console.log('Varaaja lisätty onnistuneesti:', response.data)
        getVaraajat()
    })
    .catch(error => {
        console.error(`Virhe lisätessä varaajaa ${varaaja}:`, error)
    })

    return false
}

function deleteVaraaja(varaaja_id) {
    axios.delete(`http://localhost:8000/varaajat/${varaaja_id}`)
        .then((response) => {
            console.log(`Varaaja ${varaaja_id} poistettiin onnistuneesti`)
            getVaraajat()
        })
        .catch(error => {
            console.error(`Virhe poistettaessa varaajaa ${varaaja_id}:`, error)
        })
}

// Tilat
function getTilat() {
    axios('http://localhost:8000/tilat')
        .then(response => {
            console.log('Tilat:', response.data)
            createTilaTable(response.data)
            createTilaDropdown(response.data)
        })
        .catch(error => {
            console.error(`Virhe hakiessa tiloja:`, error)
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

            const delete_cell = document.createElement('td')
            const delete_button = document.createElement('button')
            delete_button.textContent= 'X'
            delete_button.onclick = function() {
                deleteTila(tila.id)
            }
            delete_cell.appendChild(delete_button)
            row.appendChild(delete_cell)

            tila_table.appendChild(row)
        }
    }
    else {
        console.error('tila_table ei löytynyt')
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
    else {
        console.error('tilat_dropdown ei löytynyt')
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
            console.log('Tila lisätty onnistuneesti:', response.data)
            getTilat()
        })
        .catch(error => {
            console.error(`Virhe lisätessä tilaa ${tila}:`, error)
        })
    
    return false
}

function deleteTila(tila_id) {
    axios.delete(`http://localhost:8000/tilat/${tila_id}`)
        .then((response) => {
            console.log(`Tila ${tila_id} poistettiin onnistuneesti`)
            getTilat()
        })
        .catch(error => {
            console.error(`Virhe poistettaessa tilaa ${tila_id}:`, error)
        })
}

// Varaukset
function getVaraukset() {
    axios('http://localhost:8000/varaukset')
        .then(response => {
            console.log('Varaukset:', response.data)
            createVarausTable(response.data)
        })
        .catch(error => {
            console.error(`Virhe hakiessa varauksia:`, error)
        })
}

function createVarausTable(varaukset) {
    const varaus_table = document.querySelector('#varaus-table tbody')   

    if (varaus_table) {
        varaus_table.innerHTML = ''

        for (let varaus of varaukset) {
            const row = document.createElement('tr')
            
            const id_cell = document.createElement('td')
            id_cell.textContent = varaus.id
            row.appendChild(id_cell)

            const varauspaiva_cell = document.createElement('td')
            varauspaiva_cell.textContent = varaus.varauspaiva
            row.appendChild(varauspaiva_cell)

            const varaaja_cell = document.createElement('td')
            varaaja_cell.textContent = varaus.varaaja
            row.appendChild(varaaja_cell)

            const tila_cell = document.createElement('td')
            tila_cell.textContent = varaus.tila
            row.appendChild(tila_cell)

            const delete_cell = document.createElement('td')
            const delete_button = document.createElement('button')
            delete_button.textContent = 'X'
            delete_button.onclick = function() {
                deleteVaraus(varaus.id)
            }
            delete_cell.appendChild(delete_button)
            row.appendChild(delete_cell)

            varaus_table.appendChild(row)
        }
    }
    else {
        console.error('varaus_table ei löytynyt')
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
            console.log('Varaus lisättiin onnistuneesti', response.data)
            getVaraukset()
        })
        .catch(error => {
            console.error(`Virhe lisätessä varausta ${varaus}:`, error)
        })
    
    return false
}

function deleteVaraus(varaus_id) {

    axios.delete(`http://localhost:8000/varaukset/${varaus_id}`)
        .then((response) => {
            console.log(`Varaus ${varaus_id} poistettiin onnistuneesti`)
            getVaraukset()
        })
        .catch(error => {
            console.error(`Virhe poistettaessa varausta ${varaus_id}:`, error)
        })
}

document.addEventListener('DOMContentLoaded', function() {
    getVaraajat()
    getTilat()
    getVaraukset()
})
