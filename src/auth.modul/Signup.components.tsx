import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useState } from 'react'
import logo from '../assets/logo_complete.jpeg'

const Signup = () => {
    const [darkMode, setDarkMode] = useState(false)

    const toggleTheme = () => setDarkMode(!darkMode)

    // Classes conditionnelles selon le thème
    const bgClass = darkMode ? 'bg-slate-900' : 'bg-gray-50'
    const cardBg = darkMode ? 'bg-slate-800' : 'bg-white'
    const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
    const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
    const textLabel = darkMode ? 'text-gray-300' : 'text-gray-700'
    const borderColor = darkMode ? 'border-slate-600' : 'border-gray-200'
    const inputBg = darkMode ? 'bg-slate-700' : 'bg-white'
    const inputText = darkMode ? 'text-white' : 'text-gray-900'
    const shadowClass = darkMode ? 'shadow-slate-900/30' : 'shadow-gray-200/50'
    const btnHover = darkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-800'
    const linkColor = darkMode ? 'text-blue-400' : 'text-gray-900'

    return (
        <div className={`${bgClass} min-h-screen flex items-center justify-center transition-colors duration-300`}>
            {/* Toggle Dark/Light */}
            <button
                onClick={toggleTheme}
                className={`fixed top-4 right-4 p-3 rounded-full ${cardBg} ${shadowClass} shadow-lg transition-all duration-300 hover:scale-110 z-50`}
                title={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
                {darkMode ? (
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                )}
            </button>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                    {/* Left Side - Informations personnelles */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <div className={`${cardBg} ${shadowClass} shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 h-full transition-all duration-300`}>
                            <div className="text-center mb-6 md:mb-8">
                                <img 
                                    className="rounded-full mx-auto w-16 h-16 sm:w-20 sm:h-20 object-cover shadow-md" 
                                    src={logo} 
                                    alt="Logo" 
                                />
                            </div>

                            <div className="text-center mb-6 md:mb-8">
                                <h1 className={`text-2xl sm:text-3xl font-bold ${textPrimary} transition-colors duration-300`}>
                                    Inscription
                                </h1>
                                <p className={`${textSecondary} mt-2 text-sm sm:text-base transition-colors duration-300`}>
                                    Informations personnelles
                                </p>
                            </div>

                            <FormControl component="form" className="w-full">
                                {/* Nom */}
                                <div className="mb-4 sm:mb-5">
                                    <p className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}>
                                        Nom
                                    </p>
                                    <TextField 
                                        fullWidth
                                        placeholder="Votre nom"
                                        variant="outlined" 
                                        size="medium"
                                        className="transition-all duration-300"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                backgroundColor: darkMode ? '#334155' : '#fff',
                                                color: darkMode ? '#fff' : '#111827',
                                                '& fieldset': {
                                                    borderColor: darkMode ? '#475569' : '#e5e7eb',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: darkMode ? '#64748b' : '#9ca3af',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: darkMode ? '#60a5fa' : '#1a1a1a',
                                                },
                                            },
                                            '& .MuiInputBase-input::placeholder': {
                                                color: darkMode ? '#94a3b8' : '#9ca3af',
                                                opacity: 1,
                                            },
                                        }}
                                    />
                                </div>

                                {/* Prénom */}
                                <div className="mb-4 sm:mb-5">
                                    <p className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}>
                                        Prénom
                                    </p>
                                    <TextField 
                                        fullWidth
                                        placeholder="Votre prénom"
                                        variant="outlined" 
                                        size="medium"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                backgroundColor: darkMode ? '#334155' : '#fff',
                                                color: darkMode ? '#fff' : '#111827',
                                                '& fieldset': {
                                                    borderColor: darkMode ? '#475569' : '#e5e7eb',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: darkMode ? '#64748b' : '#9ca3af',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: darkMode ? '#60a5fa' : '#1a1a1a',
                                                },
                                            },
                                            '& .MuiInputBase-input::placeholder': {
                                                color: darkMode ? '#94a3b8' : '#9ca3af',
                                                opacity: 1,
                                            },
                                        }}
                                    />
                                </div>

                                {/* Fonction */}
                                <div className="mb-4 sm:mb-5">
                                    <p className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}>
                                        Fonction
                                    </p>
                                    <FormControl fullWidth size="medium">
                                        <InputLabel 
                                            sx={{ 
                                                color: darkMode ? '#94a3b8' : '#6b7280',
                                                '&.Mui-focused': { color: darkMode ? '#60a5fa' : '#1a1a1a' }
                                            }}
                                        >
                                            Poste occupé
                                        </InputLabel>
                                        <Select
                                            label="Poste occupé"
                                            defaultValue=""
                                            sx={{
                                                borderRadius: '12px',
                                                backgroundColor: darkMode ? '#334155' : '#fff',
                                                color: darkMode ? '#fff' : '#111827',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: darkMode ? '#475569' : '#e5e7eb',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: darkMode ? '#64748b' : '#9ca3af',
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: darkMode ? '#60a5fa' : '#1a1a1a',
                                                },
                                            }}
                                            MenuProps={{
                                                slotProps: {
                                                    paper: {
                                                        sx: {
                                                            backgroundColor: darkMode ? '#334155' : '#fff',
                                                            color: darkMode ? '#fff' : '#111827',
                                                        }
                                                    }
                                                }
                                            }}
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
                                <div className="mb-4 sm:mb-5">
                                    <p className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}>
                                        N+1 Assigner
                                    </p>
                                    <FormControl fullWidth size="medium">
                                        <InputLabel 
                                            sx={{ 
                                                color: darkMode ? '#94a3b8' : '#6b7280',
                                                '&.Mui-focused': { color: darkMode ? '#60a5fa' : '#1a1a1a' }
                                            }}
                                        >
                                            Personne responsable
                                        </InputLabel>
                                        <Select
                                            label="Personne responsable"
                                            defaultValue=""
                                            sx={{
                                                borderRadius: '12px',
                                                backgroundColor: darkMode ? '#334155' : '#fff',
                                                color: darkMode ? '#fff' : '#111827',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: darkMode ? '#475569' : '#e5e7eb',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: darkMode ? '#64748b' : '#9ca3af',
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: darkMode ? '#60a5fa' : '#1a1a1a',
                                                },
                                            }}
                                            MenuProps={{
                                                slotProps: {
                                                    paper: {
                                                        sx: {
                                                            backgroundColor: darkMode ? '#334155' : '#fff',
                                                            color: darkMode ? '#fff' : '#111827',
                                                        }
                                                    }
                                                }
                                            }}
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
                    <Grid size={{ xs: 12, md: 6 }}>
                        <div className={`${cardBg} ${shadowClass} shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 h-full transition-all duration-300`}>
                            <div className="text-center mb-6 md:mb-8">
                                <div className={`w-14 h-14 sm:w-16 sm:h-16 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300`}>
                                    <span className="text-2xl sm:text-3xl">🔐</span>
                                </div>
                                <h2 className={`text-xl sm:text-2xl font-bold ${textPrimary} transition-colors duration-300`}>
                                    Sécurité du compte
                                </h2>
                                <p className={`${textSecondary} mt-2 text-sm sm:text-base transition-colors duration-300`}>
                                    Informations de connexion
                                </p>
                            </div>

                            <FormControl component="form" className="w-full">
                                {/* Email */}
                                <div className="mb-4 sm:mb-5">
                                    <p className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}>
                                        Email
                                    </p>
                                    <TextField 
                                        fullWidth
                                        type="email"
                                        placeholder="exemple@email.com"
                                        variant="outlined" 
                                        size="medium"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                backgroundColor: darkMode ? '#334155' : '#fff',
                                                color: darkMode ? '#fff' : '#111827',
                                                '& fieldset': {
                                                    borderColor: darkMode ? '#475569' : '#e5e7eb',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: darkMode ? '#64748b' : '#9ca3af',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: darkMode ? '#60a5fa' : '#1a1a1a',
                                                },
                                            },
                                            '& .MuiInputBase-input::placeholder': {
                                                color: darkMode ? '#94a3b8' : '#9ca3af',
                                                opacity: 1,
                                            },
                                        }}
                                    />
                                </div>

                                {/* Nom d'utilisateur */}
                                <div className="mb-4 sm:mb-5">
                                    <p className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}>
                                        Nom d'utilisateur
                                    </p>
                                    <TextField 
                                        fullWidth
                                        placeholder="Choisissez un pseudo"
                                        variant="outlined" 
                                        size="medium"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                backgroundColor: darkMode ? '#334155' : '#fff',
                                                color: darkMode ? '#fff' : '#111827',
                                                '& fieldset': {
                                                    borderColor: darkMode ? '#475569' : '#e5e7eb',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: darkMode ? '#64748b' : '#9ca3af',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: darkMode ? '#60a5fa' : '#1a1a1a',
                                                },
                                            },
                                            '& .MuiInputBase-input::placeholder': {
                                                color: darkMode ? '#94a3b8' : '#9ca3af',
                                                opacity: 1,
                                            },
                                        }}
                                    />
                                </div>

                                {/* Mot de passe */}
                                <div className="mb-4 sm:mb-5">
                                    <p className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}>
                                        Mot de passe
                                    </p>
                                    <TextField 
                                        fullWidth
                                        type="password"
                                        placeholder="Entrez votre mot de passe"
                                        variant="outlined" 
                                        size="medium"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                backgroundColor: darkMode ? '#334155' : '#fff',
                                                color: darkMode ? '#fff' : '#111827',
                                                '& fieldset': {
                                                    borderColor: darkMode ? '#475569' : '#e5e7eb',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: darkMode ? '#64748b' : '#9ca3af',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: darkMode ? '#60a5fa' : '#1a1a1a',
                                                },
                                            },
                                            '& .MuiInputBase-input::placeholder': {
                                                color: darkMode ? '#94a3b8' : '#9ca3af',
                                                opacity: 1,
                                            },
                                        }}
                                    />
                                </div>

                                {/* Confirmation mot de passe */}
                                <div className="mb-6 sm:mb-8">
                                    <p className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}>
                                        Confirmation mot de passe
                                    </p>
                                    <TextField 
                                        fullWidth
                                        type="password"
                                        placeholder="Confirmez votre mot de passe"
                                        variant="outlined" 
                                        size="medium"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                backgroundColor: darkMode ? '#334155' : '#fff',
                                                color: darkMode ? '#fff' : '#111827',
                                                '& fieldset': {
                                                    borderColor: darkMode ? '#475569' : '#e5e7eb',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: darkMode ? '#64748b' : '#9ca3af',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: darkMode ? '#60a5fa' : '#1a1a1a',
                                                },
                                            },
                                            '& .MuiInputBase-input::placeholder': {
                                                color: darkMode ? '#94a3b8' : '#9ca3af',
                                                opacity: 1,
                                            },
                                        }}
                                    />
                                </div>

                                {/* Bouton */}
                                <Button 
                                    fullWidth
                                    variant="contained"
                                    className={`!h-12 !text-base !font-semibold !normal-case !mb-4 !rounded-xl !transition-all !duration-300 ${btnHover}`}
                                    sx={{
                                        backgroundColor: darkMode ? '#475569' : '#1a1a1a',
                                        '&:hover': {
                                            backgroundColor: darkMode ? '#334155' : '#374151',
                                        },
                                    }}
                                >
                                    S'inscrire
                                </Button>

                                {/* Lien connexion */}
                                <p className={`text-center text-sm ${textSecondary} transition-colors duration-300`}>
                                    Déjà un compte ?{' '}
                                    <a href="/" className={`${linkColor} font-semibold no-underline hover:underline transition-colors duration-300`}>
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