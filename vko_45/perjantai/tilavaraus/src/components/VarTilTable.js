import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableHead, TableBody, TableRow, TableCell } from "./TableComponents";

function VarTilTable({items, poistaItem}) {
    const { auth } = useContext(AuthContext);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
        </Paper>
    )
}
  
export default VarTilTable;