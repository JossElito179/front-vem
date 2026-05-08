import { Button, Grid, TextField } from "@mui/material"
import logo from '../assets/logo_complete.jpeg'

const Login = () => {
    return (
        <>
            <div className="main-component">
                <div className="container">
                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <div className="inline m-30">
                                <div className="container-img">
                                    <img className="rounded-full w-20 h-20" src={logo} alt="" />
                                </div>

                                <div className="mt-5 login-component flex font-semibold">
                                    <h1>Connection </h1>
                                </div>
                                <div className="container-form w-100">
                                    <div className="item-container">
                                        <form action="" method="post">
                                            <div className="form-control flex flex-col mt-5">
                                                <p className="text-start">
                                                    <label htmlFor="username"> Username</label>
                                                </p>
                                                <TextField id="outlined-basic" className="mt-10" label="👤 Nom d'utilisateur" variant="outlined" />
                                            </div>
                                            <div className="form-control flex flex-col mt-5">
                                                <p className="text-start">
                                                    <label htmlFor="username"> Mots de passe</label>
                                                </p>
                                                <TextField id="outlined-basic" className="mt-10" label=" 🔑 Entrer le mdp" variant="outlined" />
                                            </div>
                                            <div className="button-container mt-10">
                                                <Button className="w-full h-12 bg-gray-900! text-white!">
                                                    Se connecter
                                                </Button>
                                            </div>
                                            <p className="mt-5" style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
                                                Pas de compte ?{' '}
                                                <a href="/signup" style={{ color: '#1a1a1a', fontWeight: '600', textDecoration: 'none' }}>
                                                    S'inscrire
                                                </a>
                                            </p>
                                        </form>
                                    </div>
                                </div>

                            </div>
                        </Grid>
                        <Grid size={6}>
                            <div style={{
                                height: '100%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '20px',
                                padding: '40px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                <h2 style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 'bold' }}>
                                    Bienvenue !
                                </h2>
                                <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.9 }}>
                                    Plateforme de gestion d'employees
                                </p>
                                <div style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: '10px',
                                    padding: '20px',
                                    width: '100%'
                                }}>
                                    <p style={{ marginBottom: '10px' }}>✓ Accès local</p>
                                    <p style={{ marginBottom: '10px' }}>✓ Checkeur et dashboard</p>
                                    <p>✓ Fonctionnalités de gestion</p>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>
    )
}

export default Login