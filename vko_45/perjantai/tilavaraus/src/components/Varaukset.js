import { useState, useEffect } from "react";
import axios from "axios"

function Varaukset() {

    const [varauspaiva, setVarauspaiva] = useState("")
    const [varaaja, setVaraaja] = useState("")
    const [tila, setTila] = useState("")
    const [varaukset, setVaraukset] = useState([])
    const [varaajat, setVaraajat] = useState([])
    const [tilat, setTilat] = useState([])

    const lisaa_varaus = (event) => {
        event.preventDefault()

        const varaus = {
            varauspaiva: varauspaiva,
            varaaja: varaaja,
            tila: tila
        }

        console.log(varaaja)

        axios.post("http://localhost:8000/varaukset", varaus, { withCredentials: true })
        .then((response) => {
            console.log(`Varaus lisättiin onnistuneesti`)
            return axios.get("http://localhost:8000/varaukset", { withCredentials: true });
        })
        .then((response) => {
            setVaraukset(response.data)
        })
        .catch(error => {
            console.error("Virhe lisätessä varausta:", error)
        })
    }

    const poistaVaraus = (event, id) => {
        event.preventDefault()

        axios.delete(`http://localhost:8000/varaukset/${id}`, { withCredentials: true })
        .then((response) => {
            console.log("Varaus poistettiin onnistuneesti")
            return axios.get("http://localhost:8000/varaukset", { withCredentials: true });
        })
        .then((response) => {
            setVaraukset(response.data)
        })
        .catch(error => {
            console.error("Virhe poistaessa varausta:", error)
        })
    }

    useEffect(() => {
        axios.get("http://localhost:8000/varaukset", {withCredentials: true})
        .then((response) => {
            console.log("Varaukset haettiin onnistuneesti")
            console.log(response.data)
            setVaraukset(response.data)
        })
        .catch(error => {
            console.error("Virhe hakiessa varauksia:", error)
        })

        axios.get("http://localhost:8000/varaajat", {withCredentials: true})
        .then((response) => {
            console.log("Varaajat haettiin onnistuneesti")
            setVaraajat(response.data)
        })
        .catch(error => {
            console.error("Virhe hakiessa varaajia:", error)
        })

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
            <h2>Varaukset</h2>      
            <section>
                <form onSubmit={(event) => lisaa_varaus(event)}>
                    <label htmlFor="varauspaiva">Varauspaiva</label>
                    <input 
                        type="date"
                        id="varauspaiva"
                        name="varauspaiva"
                        value={varauspaiva}
                        onChange={e => setVarauspaiva(e.target.value)}
                        required
                    />

                    <label htmlFor="varaaja">Varaaja</label>
                    <select id="varaaja" name="varaaja" onChange={(e) => setVaraaja(e.target.value)} value={varaaja} required>
                        <option name="varaaja" value="" disabled placeholder="Valitse varaaja">Valitse varaaja</option>
                        {varaajat.map((varaaja) => {
                            return <option key={varaaja.id} name="varaaja" value={varaaja.id}>{varaaja.nimi}</option>
                        })}
                    </select>

                    <label htmlFor="tila">Tila</label>
                    <select id="tila" name="tila" onChange={(e) => setTila(e.target.value)} value={tila} required>
                        <option name="tila" value="" disabled>Valitse tila</option>
                        {tilat.map((tila) => {
                            return <option key={varaaja.id} name="tila" value={tila.id}>{tila.tilan_nimi}</option>
                        })}
                    </select>
                    <input type="submit" value="Lisää varaaja" />
                </form>
            </section>
            
            <section>
                {varaukset ? 
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Varauspäivä</th>
                            <th>Varaaja</th>
                            <th>Tila</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {varaukset.map((varaus) => {
                            return <tr key={varaus.id}>
                                <td>{varaus.id}</td>
                                <td>{varaus.varauspaiva}</td>
                                <td>{varaus.varaaja}</td>
                                <td>{varaus.tila}</td>
                                <td>
                                    <form onSubmit={(event) => {poistaVaraus(event, varaus.id)}}>
                                        <input type="submit" value="X" />
                                    </form>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table> 
                : <p>Haetaan varaajia...</p>
                }
            </section>
        </>
    );
}
  
export default Varaukset;