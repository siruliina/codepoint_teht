import axios from "axios"
import { useForm } from "react-hook-form";
import useGetApiData from "../hooks/useGetApiData";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

function Varaukset() {

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const {
        data: varauksetData,
        loading: varauksetLoading, 
        error: varauksetError, 
        refetch: varauksetRefetch} = useGetApiData("http://localhost:8000/varaukset")

    const {
        data: varaajatData,
        loading: varaajatLoading,
        error: varaajatError} = useGetApiData("http://localhost:8000/varaajat")

    const {
        data: tilatData,
        loading: tilatLoading,
        error: tilatError} = useGetApiData("http://localhost:8000/tilat")
    
    const varaajaValue = watch('varaaja', '');
    const tilaValue = watch('tila', '');

    const lisaaVaraus = (data) => {

        const varaus = {
            varauspaiva: data.varauspaiva,
            varaaja: data.varaaja,
            tila: data.tila
        }

        axios.post("http://localhost:8000/varaukset", varaus, { withCredentials: true })
        .then((response) => {
            console.log(`Varaus lisättiin onnistuneesti`)
            varauksetRefetch()
        })
        .catch(error => {
            console.error("Virhe lisätessä varausta:", error)
        })
    }

    const poistaVaraus = (id) => {

        axios.delete(`http://localhost:8000/varaukset/${id}`, { withCredentials: true })
        .then((response) => {
            console.log("Varaus poistettiin onnistuneesti")
            varauksetRefetch()
        })
        .catch(error => {
            console.error("Virhe poistaessa varausta:", error)
        })
    }

    if (varauksetLoading || varaajatLoading || tilatLoading) {
        return <Typography variant="body2">Ladataan...</Typography>
    }

    if (varauksetError || varaajatError || tilatError) {
        return <Typography variant="body2">Esiintyi virhe: {varauksetError || varaajatError || tilatError}</Typography>
    }

    return (
        <>     
            <Typography variant="h2" gutterBottom align="center" sx={{ fontSize: "34px" }}>Varaukset</Typography>      
            <Box component="section">
                <Box component="form" onSubmit={handleSubmit(lisaaVaraus)}>

                    <FormControl fullWidth error={!!errors.varauspaiva}>
                        <TextField
                            type="date"
                            id="varauspaiva"
                            label="Varauspaiva"
                            {...register('varauspaiva', {
                                required: "Tämä kenttä on pakollinen.",
                                valueAsDate: true
                            })}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,  // Tämä varmistaa, että label pysyy ylhäällä kentän sisällä
                                }
                            }}
                        />
                    </FormControl>
                    <div>
                        {errors.varauspaiva && <Typography variant="body2">{errors.varauspaiva.message}</Typography>}
                    </div><br/>

                    <FormControl fullWidth error={!!errors.varaaja}>
                        <InputLabel htmlFor="varaaja">Varaaja</InputLabel>
                        <Select 
                            id="varaaja"
                            name="varaaja" 
                            label="Varaaja"
                            value={varaajaValue}
                            {...register('varaaja', { required: "Tämä kenttä on pakollinen."})}
                        >
                            {varaajatData.map((varaaja) => {
                                return <MenuItem key={varaaja.id} name="varaaja" value={varaaja.id}>{varaaja.nimi}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    <div>
                        {errors.varaaja && <Typography variant="body2">{errors.varaaja.message}</Typography>}
                    </div><br/>

                    <FormControl fullWidth error={!!errors.tila}>
                        <InputLabel htmlFor="tila">Tila</InputLabel>
                        <Select 
                            id="tila"
                            name="tila"
                            label="Tila"
                            value={tilaValue}
                            {...register('tila', { required: "Tämä kenttä on pakollinen."})}
                        >
                            {tilatData.map((tila) => {
                                return <MenuItem key={tila.id} value={tila.id}>{tila.tilan_nimi}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    
                    {errors.tila && <Typography variant="body2">{errors.tila.message}</Typography>}<br/>

                    <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>Lisää varaus</Button>
                </Box>
            </Box>
            
            <Box component="section" sx={{ marginTop: 2 }}>
                {varauksetData ? 
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 400 }}>
                        <Table stickyHeader>

                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Varauspäivä</TableCell>
                                    <TableCell>Varaaja</TableCell>
                                    <TableCell>Tila</TableCell>
                                    <TableCell>Poista</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {varauksetData.map((varaus) => {
                                    return <TableRow key={varaus.id}>
                                        <TableCell>{varaus.id}</TableCell>
                                        <TableCell>{varaus.varauspaiva}</TableCell>
                                        <TableCell>{varaus.varaaja}</TableCell>
                                        <TableCell>{varaus.tila}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" onClick={() => {poistaVaraus(varaus.id)}}><DeleteIcon /></Button>
                                        </TableCell>
                                    </TableRow>
                                })}
                            </TableBody>

                        </Table> 
                    </TableContainer>
                </Paper>
                : <Typography variant="body2">Haetaan varauksia...</Typography>
                }
            </Box>
        </>
    );
}
  
export default Varaukset;