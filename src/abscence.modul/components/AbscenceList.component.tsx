import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const AbscenceListComponent = () => {
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
        <div className="bg-white rounded-lg shadow-md p-6 w-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Historique d'absence</h2>

            <div className="list-story">
                <div className="for-title">
                    <Grid container spacing={2} >
                        <Grid size={6}>
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
                        </Grid>
                        <Grid size={6}>
                            <select
                                name="priorite"
                                // value={formData.priorite}
                                // onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                                <option value="basse">Mois</option>
                                <option value="normale">Normale</option>
                                <option value="haute">Haute</option>
                                <option value="urgente">Urgente</option>
                            </select>
                        </Grid>

                    </Grid>
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
                <div className="button-container mt-5">
                    <a href="/abscence/demande">
                        <Button className=" w-70 h-12 bg-gray-900! text-white!" >
                            Demander une abscence
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AbscenceListComponent;