import axios from "axios"
import { useNavigate } from "react-router-dom";

function Logout({setUser}) {
    const navigate = useNavigate();

    const logout = () => {
        axios.delete("http://localhost:8000/logout", {withCredentials: true})
        .then((response) => {
            console.log("Käyttäjä kirjattiin ulos onnistuneesti")
            setUser(false)
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