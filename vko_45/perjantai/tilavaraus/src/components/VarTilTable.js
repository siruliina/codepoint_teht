import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';

function VarTilTable({items, poistaItem}) {
    const { auth } = useContext(AuthContext);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nimi</TableCell>
                            {auth?.user?.rooli === "admin" ? <TableCell>Poista</TableCell> : null }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {items.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.tilan_nimi || item.nimi}</TableCell>
                                {auth?.user?.rooli === "admin" ? (
                                    <TableCell>
                                        <Button variant="contained" onClick={() => poistaItem(item.id)}><DeleteIcon /></Button>
                                    </TableCell>
                                ) : null}
                                
                            </TableRow>
                        ))
                    }
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
  
export default VarTilTable;