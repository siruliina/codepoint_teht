import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './App.css';
import Login from './components/Login';
import Logout from './components/Logout';
import Etusivu from "./components/Etusivu";
import Varaajat from "./components/Varaajat";
import Tilat from "./components/Tilat";

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/">Etusivu</Link>
                <Link to="/varaajat">Varaajat</Link>
                <Link to="/tilat">Tilat</Link>
                <Link to="/varaukset">Varaukset</Link>
                <Link to="/login">Kirjaudu sisään</Link>
                <Link to="/logout">Kirjaudu ulos</Link>
            </nav>
            
            <Routes>
                <Route index element={<Etusivu />} />
                <Route path="/varaajat" element={<Varaajat />} />
                <Route path="/tilat" element={<Tilat />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
