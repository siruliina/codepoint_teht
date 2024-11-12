import { useContext } from "react";
import { AuthContext } from "../AuthContext";

function VarTilTable({items, poistaItem}) {
    const { auth } = useContext(AuthContext);

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nimi</th>
                    {auth?.user?.rooli === "admin" ? <th></th> : null }
                </tr>
            </thead>
            <tbody>
            {items.map((item, index) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.tilan_nimi || item.nimi}</td>
                        {auth?.user?.rooli === "admin" ? (
                            <td>
                                <form onSubmit={(event) => poistaItem(event, item.id)}>
                                    <input type="submit" value="X" />
                                </form>
                            </td>
                        ) : null}
                        
                    </tr>
                ))
            }
            </tbody>
        </table>
    )
}
  
export default VarTilTable;