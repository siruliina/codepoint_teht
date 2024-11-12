import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom"; 
import './App.css';
import Login from './components/Login';
import Logout from './components/Logout';
import Etusivu from "./components/Etusivu";
import Varaajat from "./components/Varaajat";
import Tilat from "./components/Tilat";
import Varaukset from "./components/Varaukset";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./AuthContext";
import Navbar from "./components/Navbar";

function App() {
    //const { auth } = useContext(AuthContext) || {}; // Lisää oletusarvo {}

    /*function ProtectedRoute({ children, allowedRoles }) {
        if (!auth) {
            return <Navigate to="/login" />;
        }

        if (allowedRoles && !allowedRoles.includes(auth?.user?.role)) {
            return <Navigate to="/" />;
        }

        return children;
    }*/

    return (
        <AuthProvider>
            <BrowserRouter>
                <header>                    
                    <Navbar />
                    <h1>Tilanvarausjärjestelmä</h1>
                </header>
                
                <Routes>
                    <Route index element={<Etusivu />} />
                    <Route path="/varaajat" element={<Varaajat />} />
                    <Route path="/tilat" element={<Tilat />} />
                    <Route path="/varaukset" element={<Varaukset />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
