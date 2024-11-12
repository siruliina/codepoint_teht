import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    if (!auth) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;