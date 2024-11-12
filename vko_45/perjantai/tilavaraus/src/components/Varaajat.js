import { useState, useEffect, useContext } from "react";
import axios from "axios"
import VarTilTable from "./VarTilTable";
import { AuthContext } from "../AuthContext";

function Varaajat() {

    const [nimi, setNimi] = useState("")
    const [varaajat, setVaraajat] = useState([])
    const { auth } = useContext(AuthContext);
    console.log(auth)

    const lisaa_varaaja = (event) => {
        event.preventDefault()

        const varaaja = {
            nimi: nimi
        }

        axios.post("http://localhost:8000/varaajat", varaaja, { withCredentials: true })
        .then((response) => {
            console.log(`Varaaja ${nimi} lisättiin onnistuneesti`)
            return axios.get("http://localhost:8000/varaajat", { withCredentials: true });
        })
        .then((response) => {
            setVaraajat(response.data)
        })
        .catch(error => {
            console.error("Virhe lisätessä varaajaa:", error)
        })
    }

    const poistaVaraaja = (event, id) => {
        event.preventDefault()

        axios.delete(`http://localhost:8000/varaajat/${id}`, { withCredentials: true })
        .then((response) => {
            console.log("Varaaja poistettiin onnistuneesti")
            return axios.get("http://localhost:8000/varaajat", { withCredentials: true });
        })
        .then((response) => {
            setVaraajat(response.data)
        })
        .catch(error => {
            console.error("Virhe poistaessa varaajaa:", error)
        })
    }

    useEffect(() => {
        axios.get("http://localhost:8000/varaajat", {withCredentials: true})
        .then((response) => {
            console.log("Varaajat haettiin onnistuneesti")
            setVaraajat(response.data)
        })
        .catch(error => {
            console.error("Virhe hakiessa varaajia:", error)
        })
    }, [])

    return (
        <>   
            <h2>Varaajat</h2>        
            {auth?.user?.rooli === "admin" && (
                <section>
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
                </section>
            )}
            
            <section>
                {varaajat ? (
                    <VarTilTable 
                        items={varaajat} 
                        poistaItem={auth?.user?.rooli === "admin" ? poistaVaraaja : null} /> 
                ) : <p>Haetaan varaajia...</p>}
            </section>
        </>
    );
}
  
export default Varaajat;