import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import logo from '../assets/logo_complete.jpeg'

const Signup = () => {



    return (
        <div className="main-component" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                <Grid container spacing={4}>
                    {/* Left Side - Informations personnelles */}
                    <Grid size={6}>
                        <div style={{ 
                            padding: '40px', 
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            height: '100%'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <img 
                                    className="rounded-full" 
                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                                    src={logo} 
                                    alt="Logo" 
                                />
                            </div>

                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a' }}>
                                    Inscription
                                </h1>
                                <p style={{ color: '#666', marginTop: '10px' }}>
                                    Informations personnelles
                                </p>
                            </div>

                            <FormControl component="form" style={{ width: '100%' }}>
                                {/* Nom */}
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ textAlign: 'left', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        Nom
                                    </p>
                                    <TextField 
                                        fullWidth
                                        placeholder="Votre nom"
                                        variant="outlined" 
                                        size="medium"
                                    />
                                </div>

                                {/* Prénom */}
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ textAlign: 'left', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        Prénom
                                    </p>
                                    <TextField 
                                        fullWidth
                                        placeholder="Votre prénom"
                                        variant="outlined" 
                                        size="medium"
                                    />
                                </div>

                                {/* Fonction */}
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ textAlign: 'left', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        Fonction
                                    </p>
                                    <FormControl fullWidth size="medium">
                                        <InputLabel>Poste occupé</InputLabel>
                                        <Select
                                            label="Poste occupé"
                                            defaultValue=""
                                        >
                                            <MenuItem value="dev">Développeur</MenuItem>
                                            <MenuItem value="marketer">Marketeur</MenuItem>
                                            <MenuItem value="support">Support technique</MenuItem>
                                            <MenuItem value="manager">Manager</MenuItem>
                                            <MenuItem value="designer">Designer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* N+1 Assigner */}
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ textAlign: 'left', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        N+1 Assigner
                                    </p>
                                    <FormControl fullWidth size="medium">
                                        <InputLabel>Personne responsable</InputLabel>
                                        <Select
                                            label="Personne responsable"
                                            defaultValue=""
                                        >
                                            <MenuItem value="kage">Kage</MenuItem>
                                            <MenuItem value="henintsoa">Henintsoa</MenuItem>
                                            <MenuItem value="panda">Panda</MenuItem>
                                            <MenuItem value="najo">Najo</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </FormControl>
                        </div>
                    </Grid>

                    {/* Right Side - Informations de compte */}
                    <Grid size={6}>
                        <div style={{ 
                            padding: '40px', 
                            backgroundColor: 'white', 
                            borderRadius: '20px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            height: '100%'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <div style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    backgroundColor: '#f0f0f0', 
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px'
                                }}>
                                    <span style={{ fontSize: '30px' }}>🔐</span>
                                </div>
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a' }}>
                                    Sécurité du compte
                                </h2>
                                <p style={{ color: '#666', marginTop: '10px' }}>
                                    Informations de connexion
                                </p>
                            </div>

                            <FormControl component="form" style={{ width: '100%' }}>
                                {/* Email */}
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ textAlign: 'left', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        Email
                                    </p>
                                    <TextField 
                                        fullWidth
                                        type="email"
                                        placeholder="exemple@email.com"
                                        variant="outlined" 
                                        size="medium"
                                    />
                                </div>

                                {/* Nom d'utilisateur */}
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ textAlign: 'left', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        Nom d'utilisateur
                                    </p>
                                    <TextField 
                                        fullWidth
                                        placeholder="Choisissez un pseudo"
                                        variant="outlined" 
                                        size="medium"
                                    />
                                </div>

                                {/* Mot de passe */}
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ textAlign: 'left', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        Mot de passe
                                    </p>
                                    <TextField 
                                        fullWidth
                                        type="password"
                                        placeholder="Entrez votre mot de passe"
                                        variant="outlined" 
                                        size="medium"
                                    />
                                </div>

                                {/* Confirmation mot de passe */}
                                <div style={{ marginBottom: '30px' }}>
                                    <p style={{ textAlign: 'left', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        Confirmation mot de passe
                                    </p>
                                    <TextField 
                                        fullWidth
                                        type="password"
                                        placeholder="Confirmez votre mot de passe"
                                        variant="outlined" 
                                        size="medium"
                                    />
                                </div>

                                {/* Bouton */}
                                <Button 
                                    fullWidth
                                    variant="contained"
                                    style={{ 
                                        height: '48px', 
                                        backgroundColor: '#1a1a1a',
                                        textTransform: 'none',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        marginBottom: '15px'
                                    }}
                                    className="hover:bg-gray-800!"
                                >
                                    S'inscrire
                                </Button>

                                {/* Lien connexion */}
                                <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
                                    Déjà un compte ?{' '}
                                    <a href="/" style={{ color: '#1a1a1a', fontWeight: '600', textDecoration: 'none' }}>
                                        Se connecter
                                    </a>
                                </p>
                            </FormControl>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default Signup