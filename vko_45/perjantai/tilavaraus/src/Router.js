import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Etusivu from "./components/Etusivu";
import Varaajat from "./components/Varaajat";
import Tilat from "./components/Tilat";
import Varaukset from "./components/Varaukset";
import Logout from "./components/Logout";
import Login from "./components/Login";

const Router = () => {
    const { auth } = useContext(AuthContext);

    return (
        <>
            <Routes>
                <Route 
                    path="/login" 
                    element={auth ? <Navigate to="/" /> : <Login />} 
                />
                {auth ? (
                    <>
                        <Route index element={<Etusivu />} />
                        <Route path="/varaajat" element={<Varaajat />} />
                        <Route path="/tilat" element={<Tilat />} />
                        <Route path="/varaukset" element={<Varaukset />} />
                        <Route path="/logout" element={<Logout />} />
                    </>
                ) : (
                    <Route path="*" element={<Navigate to="/login" />} />
                )}
            </Routes>
        </>
    );
};

export default Router;
