function VarTilTable({items, poistaItem}) {


    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nimi</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {items.map((item, index) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.tilan_nimi || item.nimi}</td>
                        <td>
                            <form onSubmit={(event) => poistaItem(event, item.id)}>
                                <input type="submit" value="X" />
                            </form>
                        </td>
                    </tr>
                ))
            }
            </tbody>
        </table>
    )
}
  
export default VarTilTable;