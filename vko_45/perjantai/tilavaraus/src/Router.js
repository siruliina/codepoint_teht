import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Etusivu from "./pages/Etusivu";
import Varaajat from "./pages/Varaajat";
import Tilat from "./pages/Tilat";
import Varaukset from "./pages/Varaukset";
import Logout from "./pages/Logout";
import Login from "./pages/Login";

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
