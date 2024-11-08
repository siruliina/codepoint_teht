import axios from "axios"

function Logout() {

    const logout = () => {

        console.log("logoutissa ollaan")

        axios.delete("http://localhost:8000/logout", {withCredentials: true})
        .then((response) => {
            console.log("Käyttäjä kirjattiin ulos onnistuneesti")
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