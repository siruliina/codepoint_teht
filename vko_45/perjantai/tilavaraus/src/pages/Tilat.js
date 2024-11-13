import { useContext } from "react";
import axios from "axios";
import VarTilTable from "../components/VarTilTable";
import { AuthContext } from "../AuthContext";
import { useForm } from "react-hook-form";
import useGetApiData from "../hooks/useGetApiData";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

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

    const poistaTila = (id) => {

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
            <Typography variant="h2" gutterBottom align="center" sx={{ fontSize: "34px" }}>Tilat</Typography>
            {auth?.user?.rooli === "admin" && (
                <Box component="section">
                    <Box component="form" onSubmit={handleSubmit(lisaaTila)}>
                        <FormControl fullWidth error={!!errors.nimi}>
                            <TextField
                                id="nimi"
                                label="Nimi"
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
                        </FormControl>
                        {errors.nimi && <span>{errors.nimi.message}</span>}
                        <Grid container sx={{ marginTop: 2 }}>
                            <Button type="submit" variant="contained" >Lisää tila</Button>
                        </Grid>
                    </Box>
                </Box>
            )}

            <Box component="section" sx={{ marginTop: 2 }}>
                {data ? (
                    <VarTilTable 
                        items={data}
                        poistaItem={auth?.user?.rooli === "admin" ? poistaTila : null }
                    />) : <p>Haetaan tiloja...</p>}                
            </Box>
        </>
    )
}
  
export default Tilat;