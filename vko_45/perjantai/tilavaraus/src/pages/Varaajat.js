import { useContext } from "react";
import axios from "axios";
import VarTilTable from "../components/VarTilTable";
import { AuthContext } from "../AuthContext";
import { useForm } from "react-hook-form"
import useGetApiData from "../hooks/useGetApiData";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";

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

    const poistaVaraaja = (id) => {

        axios.delete(`http://localhost:8000/varaajat/${id}`, { withCredentials: true })
        .then((response) => {
            console.log("Varaaja poistettiin onnistuneesti")
            refetch()
        })
        .catch(error => {
            console.error("Virhe poistaessa varaajaa:", error)
        })
    }

    if (loading) return <Typography variant="body2">Ladataan...</Typography>;
    if (error) return <Typography variant="body2">Virhe: {error}</Typography>;

    return (
        <>   
            <Typography variant="h2" gutterBottom align="center" sx={{ fontSize: "34px" }}>Varaajat</Typography>    
             
            {auth?.user?.rooli === "admin" && (
                <Box component="section">
                    <Box component="form" onSubmit={handleSubmit(lisaaVaraaja)}>
                        <FormControl fullWidth error={!!errors.nimi}>
                            <TextField
                                id="nimi"
                                label="Nimi"
                                name="nimi"
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
                        </FormControl>
                        {errors.nimi && <Typography variant="body2">{errors.nimi.message}</Typography>}<br/>

                        <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>Lisää varaaja</Button>
                    </Box>
                </Box>
            )}
            
            <Box component="section" sx={{ marginTop: 2 }}>
                {data ? (
                    <VarTilTable 
                        items={data} 
                        poistaItem={auth?.user?.rooli === "admin" ? poistaVaraaja : null} /> 
                ) : <Typography variant="body2">Haetaan varaajia...</Typography>}
            </Box>
        </>
    );
}
  
export default Varaajat;