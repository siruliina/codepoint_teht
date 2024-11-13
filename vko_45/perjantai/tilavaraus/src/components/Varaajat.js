import { useContext } from "react";
import axios from "axios"
import VarTilTable from "./VarTilTable";
import { AuthContext } from "../AuthContext";
import { useForm } from "react-hook-form"
import useGetApiData from "../hooks/useGetApiData";

function Varaajat() {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const { auth } = useContext(AuthContext);
    
    const {data, loading, error, refetch} = useGetApiData("http://localhost:8000/varaajat")

    const lisaaVaraaja = (data) => {

        const varaaja = {
            nimi: data.nimi
        }

        axios.post("http://localhost:8000/varaajat", varaaja, { withCredentials: true })
        .then((response) => {
            console.log(`Varaaja ${data.nimi} lisättiin onnistuneesti`)
            refetch()
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
            refetch()
        })
        .catch(error => {
            console.error("Virhe poistaessa varaajaa:", error)
        })
    }

    if (loading) return <p>Ladataan...</p>;
    if (error) return <p>Virhe: {error}</p>;

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
                            {...register('nimi', { 
                                required: "Tämä kenttä on pakollinen.", 
                                minLength: {
                                    value: 5,
                                    message: "Nimen on oltava vähintään 5 merkkiä pitkä."
                                },
                                maxLength: {
                                    value: 20,
                                    message: "Nimi voi olla enintään 20 merkkiä pitkä."
                                }
                            })}
                        />
                        {errors.nimi && <span>{errors.nimi.message}</span>}
                        <input type="submit" value="Lisää varaaja" />
                    </form>
                </section>
            )}
            
            <section>
                {data ? (
                    <VarTilTable 
                        items={data} 
                        poistaItem={auth?.user?.rooli === "admin" ? poistaVaraaja : null} /> 
                ) : <p>Haetaan varaajia...</p>}
            </section>
        </>
    );
}
  
export default Varaajat;