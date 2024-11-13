import { useContext } from "react";
import axios from "axios"
import VarTilTable from "./VarTilTable";
import { AuthContext } from "../AuthContext";
import { useForm } from "react-hook-form"
import useGetApiData from "../hooks/useGetApiData";

function Tilat() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { auth } = useContext(AuthContext);
    const {data, loading, error, refetch} = useGetApiData("http://localhost:8000/tilat");

    const lisaaTila = (data) => {

        const tila = {
            tilan_nimi: data.nimi
        }

        axios.post("http://localhost:8000/tilat", tila, {withCredentials: true})
        .then((response) => {
            console.log(`Tila ${data.nimi} lisättiin onnistuneesti`)
            refetch()
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
            refetch()
        })
        .catch(error => {
            console.error("Virhe poistaessa tilaa:", error)
        })
    }

    if (loading) {
        return <p>Ladataan...</p>
    }
    if (error) {
        return <p>Virhe: {error}</p>
    }

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
                            {...register('nimi', { 
                                required: "Tämä kenttä on pakollinen.",
                                minLength: {
                                    value: 5,
                                    message: "Tilan nimen on oltava vähintään 5 merkkiä pitkä"
                                },
                                maxLength: {
                                    value: 20,
                                    message: "Tilan nimi voi olla enintään 20 merkkiä pitkä"
                                }
                            })}
                        />
                        {errors.nimi && <span>{errors.nimi.message}</span>}
                        <input type="submit" value="Lisää tila" />
                    </form>
                </section>
            )}

            <section>
                {data ? (
                    <VarTilTable 
                        items={data}
                        poistaItem={auth?.user?.rooli === "admin" ? poistaTila : null }
                    />) : <p>Haetaan tiloja...</p>}                
            </section>
        </>
    )
}
  
export default Tilat;