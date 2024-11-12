import { useState, useEffect, useContext } from "react";
import axios from "axios"
import VarTilTable from "./VarTilTable";
import { AuthContext } from "../AuthContext";
import { useForm } from "react-hook-form"

function Tilat() {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const [nimi, setNimi] = useState("")
    const [tilat, setTilat] = useState([])
    const { auth } = useContext(AuthContext);

    const onSubmit = (data) => {
        console.log(data)
    }

    const lisaaTila = (data) => {
        //event.preventDefault()

        const tila = {
            tilan_nimi: data.nimi
        }

        axios.post("http://localhost:8000/tilat", tila, {withCredentials: true})
        .then((response) => {
            console.log(`Tila ${data.nimi} lisättiin onnistuneesti`)
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
                    <form onSubmit={handleSubmit(lisaaTila)}>
                        <label htmlFor="nimi">Nimi</label>
                        <input 
                            type="text"
                            id="nimi"
                            {...register('nimi', { required: "Tämä kenttä on pakollinen."})}
                        />
                        {errors.nimi && <span>{errors.nimi.message}</span>}
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