import { useState } from "react";
import axios from "axios"

function Varaajat() {

    const [nimi, setNimi] = useState("")

    const lisaa_varaaja = (event) => {
        event.preventDefault()

        const varaaja = {
            nimi: nimi
        }

        axios.post("http://localhost:8000/varaajat", varaaja, {withCredentials: true})
        .then((response) => {
            console.log(`Varaaja ${nimi} lisättiin onnistuneesti`)
        })
        .catch(error => {
            console.error("Virhe lisätessä varaajaa:", error)
        })
    }

    return (
        <div>
            <form onSubmit={(event) => lisaa_varaaja(event)}>
                <label htmlFor="nimi">Nimi</label>
                <input 
                    type="text"
                    id="nimi"
                    name="nimi"
                    value={nimi}
                    onChange={e => setNimi(e.target.value)}
                    required
                />
                <input type="submit" value="Lisää varaaja" />
            </form>
        </div>
    );
}
  
export default Varaajat;