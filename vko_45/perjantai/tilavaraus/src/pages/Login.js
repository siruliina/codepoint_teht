import { useContext } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useForm } from "react-hook-form"

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
        <div>
            <form onSubmit={handleSubmit(login)}>
                <label htmlFor="nimi">Nimi</label>
                <input 
                    type="text"
                    id="nimi"
                    {...register('nimi', { required: "Tämä kenttä on pakollinen."})}
                />
                <div>
                    {errors.nimi && <span>{errors.nimi.message}</span>}
                </div><br/>

                <label htmlFor="salasana">Salasana</label>
                <input 
                    type="password" 
                    id="salasana" 
                    {...register('salasana', { required: "Tämä kenttä on pakollinen."})}
                />
                <div>
                    {errors.nimi && <span>{errors.nimi.message}</span>}
                </div>
                
                <p id="error-message"></p>

                <input type="submit" value="Kirjaudu sisään" />
            </form>
        </div>
    );
}
  
export default Login;