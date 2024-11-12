import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";

function Navbar() {

    const {auth} = useContext(AuthContext)

    return (
        <>
            {auth ? (
                <nav>
                    <Link to="/">Etusivu</Link>
                    <Link to="/varaajat">Varaajat</Link>
                    <Link to="/tilat">Tilat</Link>
                    <Link to="/varaukset">Varaukset</Link>
                    <Link to="/logout">Kirjaudu ulos</Link>
                </nav>
            ) : (
                <nav>
                    <Link to="/login">Kirjaudu sisään</Link>
                </nav>
            )}
        </>
    )
}
  
export default Navbar;