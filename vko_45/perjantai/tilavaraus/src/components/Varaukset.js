import { useState, useEffect } from "react";
import axios from "axios"
import { useForm } from "react-hook-form";
import useGetApiData from "../hooks/useGetApiData";

function Varaukset() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        data: varauksetData,
        loading: varauksetLoading, 
        error: varauksetError, 
        refetch: varauksetRefetch} = useGetApiData("http://localhost:8000/varaukset")

    const {
        data: varaajatData,
        loading: varaajatLoading,
        error: varaajatError} = useGetApiData("http://localhost:8000/varaajat")

    const {
        data: tilatData,
        loading: tilatLoading,
        error: tilatError} = useGetApiData("http://localhost:8000/tilat")

    const lisaaVaraus = (data) => {

        const varaus = {
            varauspaiva: data.varauspaiva,
            varaaja: data.varaaja,
            tila: data.tila
        }

        axios.post("http://localhost:8000/varaukset", varaus, { withCredentials: true })
        .then((response) => {
            console.log(`Varaus lisättiin onnistuneesti`)
            varauksetRefetch()
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
            varauksetRefetch()
        })
        .catch(error => {
            console.error("Virhe poistaessa varausta:", error)
        })
    }

    /*useEffect(() => {

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
    }, [])*/

    if (varauksetLoading || varaajatLoading || tilatLoading) {
        return <p>Ladataan...</p>
    }

    if (varauksetError || varaajatError || tilatError) {
        return <p>Esiintyi virhe: {varauksetError || varaajatError || tilatError}</p>
    }

    return (
        <>     
            <h2>Varaukset</h2>      
            <section>
                <form onSubmit={handleSubmit(lisaaVaraus)}>
                    <label htmlFor="varauspaiva">Varauspaiva</label>
                    <input 
                        type="date"
                        id="varauspaiva"
                        {...register('varauspaiva', { 
                            required: "Tämä kenttä on pakollinen.",
                            valueAsDate: true
                        })}
                    />
                    <div>
                        {errors.varauspaiva && <span>{errors.varauspaiva.message}</span>}
                    </div><br/>

                    <label htmlFor="varaaja">Varaaja</label>
                    <select 
                        id="varaaja"
                        name="varaaja" 
                        {...register('varaaja', { required: "Tämä kenttä on pakollinen."})}
                    >
                        <option name="varaaja" value="" placeholder="Valitse varaaja">Valitse varaaja</option>
                        {varaajatData.map((varaaja) => {
                            return <option key={varaaja.id} name="varaaja" value={varaaja.id}>{varaaja.nimi}</option>
                        })}
                    </select>
                    <div>
                        {errors.varaaja && <span>{errors.varaaja.message}</span>}
                    </div><br/>

                    <label htmlFor="tila">Tila</label>
                    <select 
                        id="tila"
                        name="tila"
                        {...register('tila', { required: "Tämä kenttä on pakollinen."})}
                    >
                        <option name="tila" value="" placeholder="Valitse tila">Valitse tila</option>
                        {tilatData.map((tila) => {
                            return <option key={tila.id} name="tila" value={tila.id}>{tila.tilan_nimi}</option>
                        })}
                    </select>
                    <div>
                        {errors.tila && <span>{errors.tila.message}</span>}
                    </div><br/>
                    <input type="submit" value="Lisää varaus" />
                </form>
            </section>
            
            <section>
                {varauksetData ? 
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
                        {varauksetData.map((varaus) => {
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
                : <p>Haetaan varauksia...</p>
                }
            </section>
        </>
    );
}
  
export default Varaukset;