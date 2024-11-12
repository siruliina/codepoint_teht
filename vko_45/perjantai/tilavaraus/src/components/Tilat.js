import { useState, useEffect, useContext } from "react";
import axios from "axios"
import VarTilTable from "./VarTilTable";
import { AuthContext } from "../AuthContext";

function Tilat() {

    const [nimi, setNimi] = useState("")
    const [tilat, setTilat] = useState([])
    const { auth } = useContext(AuthContext);

    const lisaa_tila = (event) => {
        event.preventDefault()

        const tila = {
            tilan_nimi: nimi
        }

        axios.post("http://localhost:8000/tilat", tila, {withCredentials: true})
        .then((response) => {
            console.log(`Tila ${nimi} lisättiin onnistuneesti`)
            return axios.get("http://localhost:8000/tilat", { withCredentials: true });
        })
        .then((response) => {
            setTilat(response.data)
        })
        .catch(error => {
            console.error("Virhe lisätessä tilaa:", error)
        })
    }

    const poistaTila = (event, id) => {
        event.preventDefault()

        axios.delete(`http://localhost:8000/tilat/${id}`, { withCredentials: true })
        .then((response) => {
            console.log("Tila poistettiin onnistuneesti")
            return axios.get("http://localhost:8000/tilat", { withCredentials: true });
        })
        .then((response) => {
            setTilat(response.data)
        })
        .catch(error => {
            console.error("Virhe poistaessa tilaa:", error)
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
        <>
            <h2>Tilat</h2>
            {auth?.user?.rooli === "admin" && (
                <section>
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
                </section>
            )}

            <section>
                {tilat ? (
                    <VarTilTable 
                        items={tilat}
                        poistaItem={auth?.user?.rooli === "admin" ? poistaTila : null }
                    />) : <p>Haetaan tiloja...</p>}                
            </section>
        </>
    )
}
  
export default Tilat;