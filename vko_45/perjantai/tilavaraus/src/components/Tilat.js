import { useState, useEffect } from "react";
import axios from "axios"

function Tilat() {

    const [nimi, setNimi] = useState("")
    const [tilat, setTilat] = useState([])

    const lisaa_tila = (event) => {
        event.preventDefault()

        const tila = {
            tilan_nimi: nimi
        }

        axios.post("http://localhost:8000/tilat", tila, {withCredentials: true})
        .then((response) => {
            console.log(`Tila ${nimi} lisättiin onnistuneesti`)
        })
        .catch(error => {
            console.error("Virhe lisätessä tilaa:", error)
        })
    }

    useEffect(() => {
        axios.get("http://localhost:8000/tilat", {withCredentials: true})
        .then((response) => {
            console.log("Tilat haettiin onnistuneesti")
            setTilat(response.data)
        })
        .catch(error => {
            console.error("Virhe hakiessa tiloja:", error)
        })
    }, [])

    return (
        <div>
            <form onSubmit={(event) => lisaa_tila(event)}>
                <label htmlFor="nimi">Nimi</label>
                <input 
                    type="text"
                    id="nimi"
                    name="nimi"
                    value={nimi}
                    onChange={e => setNimi(e.target.value)}
                    required
                />
                <input type="submit" value="Lisää tila" />
            </form>
        </div>
    );
}
  
export default Tilat;