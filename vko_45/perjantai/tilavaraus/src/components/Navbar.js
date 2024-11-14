import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import { Box, AppBar, Button, Toolbar, Typography } from "@mui/material";
import GroupsIcon from '@mui/icons-material/Groups';

function Navbar() {

    const {auth} = useContext(AuthContext)

    return (
        <>
            {auth ? (
                <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{marginBottom: "20px"}}>
                    <Toolbar>
                        <GroupsIcon sx={{ flexGrow: 1, fontSize: "24px", marginRight: "-30px" }}/>
                        <Typography variant="h1" sx={{ flexGrow: 1, fontSize: "24px" }}>
                            TILANVARAUS
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Button color="inherit" component={Link} to="/">Etusivu</Button>
                            <Button color="inherit" component={Link} to="/varaajat">Varaajat</Button>
                            <Button color="inherit" component={Link} to="/tilat">Tilat</Button>
                            <Button color="inherit" component={Link} to="/varaukset">Varaukset</Button>
                            <Button color="inherit" component={Link} to="/logout">Kirjaudu ulos</Button>
                        </Box>
                    </Toolbar>
                </AppBar>
                </Box>
            ) : (
                <AppBar position="static" sx={{marginBottom: "20px"}}>
                    <Toolbar>
                        <Typography variant="h1" sx={{ flexGrow: 1, fontSize: "24px" }}>
                            TILANVARAUS
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}
        </>
    )
}
  
export default Navbar;