import axios from "axios"
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Logout() {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext)

    const logout = () => {
        axios.delete("http://localhost:8000/logout", {withCredentials: true})
        .then((response) => {
            console.log("Käyttäjä kirjattiin ulos onnistuneesti")
            setAuth(null)
            navigate("/login");
        })
        .catch(error => {
            console.error("Virhe kirjautuessa ulos:", error)
        })
    }

    return (
        <div>
            <button onClick={logout}>Kirjaudu ulos</button>
        </div>
    );
}
  
export default Logout;