import { BrowserRouter } from "react-router-dom"; 
import { AuthProvider } from "./AuthContext";
import Navbar from "./components/Navbar";
import Router from "./Router";
import { Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#b12c65',
            // light: lasketaan palette.primary.main:in perusteella,
            // dark: lasketaan palette.primary.main:in perusteella,
            // contrastText: lasketaan niin, että se erottuu hyvin palette.primary.main:iä vasten
        }
    },
    typography: {
        fontFamily: "Poppins",
        h1: {
            fontFamily: "Abril Fatface",
            letterSpacing: "0.1em"
        },
        h2: {
            fontFamily: "Abril Fatface"
        },
    },
    shape: {
        borderRadius: "20px"
    },
});

function App() {

    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
            <BrowserRouter>                
                    <Navbar />
                    <Typography variant="h1" gutterBottom align="center" sx={{ fontSize: "44px" }}>Tilanvarausjärjestelmä</Typography>
                <Router />
            </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
