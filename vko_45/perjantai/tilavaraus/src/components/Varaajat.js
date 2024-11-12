import { useState, useEffect, useContext } from "react";
import axios from "axios"
import VarTilTable from "./VarTilTable";
import { AuthContext } from "../AuthContext";
import { useForm } from "react-hook-form"

function Varaajat() {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const [nimi, setNimi] = useState("")
    const [varaajat, setVaraajat] = useState([])
    const { auth } = useContext(AuthContext);

    const lisaaVaraaja = (data) => {

        const varaaja = {
            nimi: data.nimi
        }

        axios.post("http://localhost:8000/varaajat", varaaja, { withCredentials: true })
        .then((response) => {
            console.log(`Varaaja ${data.nimi} lisättiin onnistuneesti`)
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
                    <form onSubmit={handleSubmit(lisaaVaraaja)}>
                        <label htmlFor="nimi">Nimi</label>
                        <input 
                            type="text"
                            id="nimi"
                            {...register('nimi', { required: "Tämä kenttä on pakollinen."})}
                        />
                        {errors.nimi && <span>{errors.nimi.message}</span>}
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