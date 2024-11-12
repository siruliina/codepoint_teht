import { BrowserRouter } from "react-router-dom"; 
import { AuthProvider } from "./AuthContext";
import Navbar from "./components/Navbar";
import Router from "./Router";

function App() {

    return (
        <AuthProvider>
            <BrowserRouter>
                <header>                    
                    <Navbar />
                    <h1>Tilanvarausjärjestelmä</h1>
                </header>
                <Router />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
