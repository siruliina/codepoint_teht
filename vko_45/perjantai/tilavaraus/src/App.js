import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './App.css';
import Login from './components/Login';
import Logout from './components/Logout';
import Etusivu from "./components/Etusivu";
import Varaajat from "./components/Varaajat";
import Tilat from "./components/Tilat";
import Varaukset from "./components/Varaukset"
import { useState, useEffect } from "react";

function App() {

    const [user, setUser] = useState(false)

    useEffect(() => {
        const hasCookie = checkCookie("sid");
        if (hasCookie) {
            console.log("Eväste löytyy!");
            setUser(true)
        } else {
            console.log("Evästettä ei löytynyt.");
            setUser(false)
        }
    }, []);

    const checkCookie = (cookieName) => {
        // Etsitään evästeen nimi ja tarkistetaan, onko eväste olemassa
        return document.cookie.split("; ").some((cookie) => cookie.startsWith(`${cookieName}=`));
    };

    return (
        <BrowserRouter>
            <header>
                
                {user ? 
                    <nav>
                        <Link to="/">Etusivu</Link>
                        <Link to="/varaajat">Varaajat</Link>
                        <Link to="/tilat">Tilat</Link>
                        <Link to="/varaukset">Varaukset</Link>
                        <Link to="/logout">Kirjaudu ulos</Link>
                    </nav>
                : 
                    <nav>
                        <Link to="/login">Kirjaudu sisään</Link>
                    </nav>
                }
                <h1>Tilanvarausjärjestelmä</h1>
            </header>
            
            <Routes>
                <Route index element={<Etusivu />} />
                <Route path="/varaajat" element={<Varaajat />} />
                <Route path="/tilat" element={<Tilat />} />
                <Route path="/varaukset" element={<Varaukset />} />
                <Route path="/login" element={<Login setUser={setUser}/>} />
                <Route path="/logout" element={<Logout setUser={setUser}/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
