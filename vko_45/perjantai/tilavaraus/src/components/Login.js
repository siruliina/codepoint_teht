import { useState, useContext } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Login({setUser}) {
    const navigate = useNavigate()
    const { setAuth } = useContext(AuthContext); 

    const [nimi, setNimi] = useState("")
    const [salasana, setSalasana] = useState("")

    const login = (event) => {
        event.preventDefault()

        const kayttaja = {
            nimi: nimi,
            salasana: salasana
        }
        
        axios.post("http://localhost:8000/login", kayttaja, {withCredentials: true})
        .then((response) => {
            console.log(`Käyttäjä ${nimi} kirjattiin sisään onnistuneesti`)
            
            const { user, sid } = response.data;
            setAuth({ user, sid });
            navigate("/")   
        })
        .catch(error => {
            console.error("Virhe kirjautuessa sisään:", error)
        })
    }

    return (
        <div>
            <form onSubmit={(event) => login(event)}>
                <label htmlFor="nimi">Nimi</label>
                <input 
                    type="text"
                    id="nimi"
                    name="nimi"
                    value={nimi}
                    onChange={e => setNimi(e.target.value)}
                    required
                />
                <label htmlFor="salasana">Salasana</label>
                <input 
                    type="password" 
                    id="salasana" 
                    name="salasana" 
                    value={salasana} 
                    onChange={e => setSalasana(e.target.value)}
                    required 
                />
                <input type="submit" value="Kirjaudu sisään" />
            </form>
        </div>
    );
}
  
export default Login;