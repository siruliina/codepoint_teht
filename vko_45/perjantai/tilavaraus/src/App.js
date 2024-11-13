import { BrowserRouter } from "react-router-dom"; 
import { AuthProvider } from "./AuthContext";
import Navbar from "./components/Navbar";
import Router from "./Router";
import { Typography } from "@mui/material";

function App() {

    return (
        <AuthProvider>
            <BrowserRouter>
                <header>                    
                    <Navbar />
                    <Typography variant="h1" gutterBottom align="center" sx={{ fontSize: "44px" }}>Tilanvarausjärjestelmä</Typography>
                </header>
                <Router />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
