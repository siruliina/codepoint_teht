import { useContext } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useForm } from "react-hook-form"
import { FormControl, Button, Box, TextField, Typography } from "@mui/material";

function Login() {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const navigate = useNavigate()
    const { setAuth } = useContext(AuthContext); 

    const login = (data) => {

        const kayttaja = {
            nimi: data.nimi,
            salasana: data.salasana
        }
        
        axios.post("http://localhost:8000/login", kayttaja, {withCredentials: true})
        .then((response) => {
            console.log(`Käyttäjä ${data.nimi} kirjattiin sisään onnistuneesti`)           
            const { user, sid } = response.data;
            setAuth({ user, sid });
            navigate("/")   
        })
        .catch(error => {
            console.error("Virhe kirjautuessa sisään:", error)
            const error_message = document.getElementById("error-message")
            error_message.innerHTML = "Käyttäjää ei löytynyt."       
        })
    }

    return (
        <>
            <Typography variant="h2" gutterBottom align="center" sx={{ fontSize: "34px" }}>Kirjaudu sisään</Typography>
            <Box component="form" onSubmit={handleSubmit(login)}>
                <FormControl fullWidth error={!!errors.nimi}>
                    <TextField 
                        type="text"
                        id="nimi"
                        label="Nimi"
                        {...register('nimi', { required: "Tämä kenttä on pakollinen."})}
                    />
                </FormControl>

                <div>
                    {errors.nimi && <Typography variant="body2">{errors.nimi.message}</Typography>}
                </div><br/>

                <FormControl fullWidth error={!!errors.salasana}>
                    <TextField 
                        type="password" 
                        id="salasana"
                        label="Salasana"
                        {...register('salasana', { required: "Tämä kenttä on pakollinen."})}
                    />
                </FormControl>
                {errors.salasana && <Typography variant="body2">{errors.salasana.message}</Typography>}<br/>
                
                <Typography variant="body2" id="error-message"></Typography>

                <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>Kirjaudu sisään</Button>
            </Box>
        </>
    );
}
  
export default Login;