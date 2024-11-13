import axios from "axios"
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

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
        <Box component="section">
            <Button variant="contained" onClick={logout}>Kirjaudu ulos</Button>
        </Box>
    );
}
  
export default Logout;