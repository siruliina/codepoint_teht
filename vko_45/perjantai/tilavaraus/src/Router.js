import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Etusivu from "./components/Etusivu";
import Varaajat from "./components/Varaajat";
import Tilat from "./components/Tilat";
import Varaukset from "./components/Varaukset";
import Logout from "./components/Logout";
import Login from "./components/Login";
import ProtectedRoute from "./ProtectedRoute";

const Router = () => {
    //const { auth } = useContext(AuthContext);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Etusivu />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/varaajat"
                element={
                    <ProtectedRoute>
                        <Varaajat />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/tilat"
                element={
                    <ProtectedRoute>
                        <Tilat />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/varaukset"
                element={
                    <ProtectedRoute>
                        <Varaukset />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/logout"
                element={
                    <ProtectedRoute>
                        <Logout />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default Router;