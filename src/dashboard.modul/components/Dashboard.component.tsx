import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Grid from "@mui/material/Grid";

const DashboardComponent = () => {

    function createData(
        date: string,
        type: string,
        motifs: string,
        status: number
    ) {
        return { date, type, motifs, status };
    }

    const rows = [
        createData('19/10/2026', 'off', 'for a reason', 24),
        createData('18/10/2026', 'off', 'for a reason', 37),
        createData('20/10/2026', 'conges', 'for a reason', 24),
        createData('16/10/2026', 'off', 'for a reason', 67),
        createData('21/10/2026', 'conges', 'for a reason', 49),
    ];

    return (
        <div className="bg-white text-start! rounded-lg shadow-md p-6 w-1000">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tableau de bord</h2>
            <div className="grid-container">
                <Grid container spacing={2} >
                    <Grid className='border rounded-2xl ' size={4} >
                        <div className="p-4">
                            <label htmlFor="" className="font-medium ">Presence de ce mois</label>
                            <h2 className="text-5xl font-bold text-gray-800 mt-5">
                                6
                            </h2>
                        </div>
                    </Grid>
                    <Grid className='rounded-2xl border' size={4} >
                        <div className="p-4">
                            <label htmlFor="" className="font-medium ">Retards pour ce mois</label>
                            <h2 className="text-5xl font-bold text-gray-800 mt-5">
                                6
                            </h2>
                        </div>
                    </Grid>
                    <Grid className='rounded-2xl border' size={4} >
                        <div className="p-4">
                            <label htmlFor="" className="font-medium ">Taux d'assiduites</label>
                            <h2 className="text-5xl font-bold text-gray-800 mt-5">
                                6 %
                            </h2>
                        </div>
                    </Grid>
                </Grid>
                <br />
                <hr />
                <br />
                <div className="list-story">
                    <div className="for-title">
                        <h2 className="text-2xl font-bold" >
                            Liste des historiques
                        </h2>
                        <div className="mt-2" >
                            <select
                                name="priorite"
                                // value={formData.priorite}
                                // onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                                <option value="basse">Abscence</option>
                                <option value="normale">Normale</option>
                                <option value="haute">Haute</option>
                                <option value="urgente">Urgente</option>
                            </select>
                        </div>
                    </div>
                    <div className="table-container pt-5">
                        <TableContainer className="border" component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell align="right">Type</TableCell>
                                        <TableCell align="right">Motifs&nbsp;(g)</TableCell>
                                        <TableCell align="right">Status&nbsp;(g)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.date}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.date}
                                            </TableCell>
                                            <TableCell align="right">{row.type}</TableCell>
                                            <TableCell align="right">{row.motifs}</TableCell>
                                            <TableCell align="right">{row.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardComponent;