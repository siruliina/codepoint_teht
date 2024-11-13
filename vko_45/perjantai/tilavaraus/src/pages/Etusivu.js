import { Typography } from "@mui/material";

function Etusivu() {

    return (
        <>
            <Typography variant="h2" gutterBottom align="center" sx={{ fontSize: "34px" }}>Etusivu</Typography>   
            <Typography variant="body1">
                Täällä voit lisätä ja poistaa varaajia, tiloja ja varauksia.
                Käytä ylälaidan navigointipalkkia siirtyäksesi sivulta toiselle.
            </Typography>
        </>
    );
}
  
export default Etusivu;