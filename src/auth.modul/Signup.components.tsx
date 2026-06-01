import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_complete.jpeg";
import ThemeToggle from "../components/ThemeToogle";
import { useToast } from "../components/Toast";
import { useAuth } from "./AuthProvider";

const Signup = () => {
  const navigate = useNavigate();
  const { success, error, warning } = useToast();
  const { register, loading } = useAuth();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [idRang, setIdRang] = useState<number | "">("");
  const [idPoste, setIdPoste] = useState<number | "">("");
  const [idManager, setIdManager] = useState<string>("");
  const [dateEmbauche, setDateEmbauche] = useState("");
  const [salaire, setSalaire] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmMotDePasse, setConfirmMotDePasse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nom || !prenom || !email || !motDePasse || !confirmMotDePasse || !idRang || !dateEmbauche || !salaire) {
      warning("Veuillez remplir tous les champs obligatoires.", {
        position: "top-center",
      });
      return;
    }

    if (motDePasse.length < 8) {
      warning("Le mot de passe doit contenir au moins 8 caractères.", {
        position: "top-center",
      });
      return;
    }

    if (motDePasse !== confirmMotDePasse) {
      warning("Les mots de passe ne correspondent pas.", {
        position: "top-center",
      });
      return;
    }

    setSubmitting(true);
    try {
      await register({
        nom,
        prenom,
        email,
        motDePasse,
        dateEmbauche,
        salaire: Number(salaire),
        idRang: Number(idRang),
        idPoste: idPoste ? Number(idPoste) : undefined,
        idManager: idManager ? Number(idManager) : undefined,
      });

      success("Compte créé avec succès.", {
        position: "top-right",
      });
      navigate("/");
    } catch (err) {
      let errorMessage = "Erreur lors de l'inscription.";

      if (axios.isAxiosError(err) && err.response?.data) {
        const responseData = err.response.data as {
          error?: string;
          message?: string;
        };
        errorMessage =
          responseData.error || responseData.message || errorMessage;
      }

      error(errorMessage, {
        position: "top-center",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    const syncTheme = () => {
      setDarkMode(root.classList.contains("dark"));
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // Classes conditionnelles selon le thème
  const bgClass = darkMode ? "bg-slate-900" : "bg-gray-50";
  const cardBg = darkMode ? "bg-slate-800" : "bg-white";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-400" : "text-gray-600";
  const textLabel = darkMode ? "text-gray-300" : "text-gray-700";
  // const borderColor = darkMode ? 'border-slate-600' : 'border-gray-200'
  // const inputBg = darkMode ? 'bg-slate-700' : 'bg-white'
  // const inputText = darkMode ? 'text-white' : 'text-gray-900'
  const shadowClass = darkMode ? "shadow-slate-900/30" : "shadow-gray-200/50";
  const btnHover = darkMode ? "hover:bg-slate-600" : "hover:bg-gray-800";
  const linkColor = darkMode ? "text-blue-400" : "text-gray-900";

  return (
    <div
      className={`${bgClass} min-h-screen flex items-center justify-center transition-colors duration-300`}
    >
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Left Side - Informations personnelles */}
          <Grid size={{ xs: 12, md: 6 }}>
            <div
              className={`${cardBg} ${shadowClass} shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 h-full transition-all duration-300`}
            >
              <div className="text-left mb-6 md:mb-8">
                <img
                  className="rounded-full w-16 h-16 sm:w-20 sm:h-20 object-cover shadow-md"
                  src={logo}
                  alt="Logo"
                />
              </div>

              <div className="text-center mb-6 md:mb-8">
                <h1
                  className={`text-2xl sm:text-3xl font-bold ${textPrimary} transition-colors duration-300`}
                >
                  Inscription
                </h1>
                <p
                  className={`${textSecondary} mt-2 text-sm sm:text-base transition-colors duration-300`}
                >
                  Informations personnelles
                </p>
              </div>

              <FormControl className="w-full">
                {/* Nom */}
                <div className="mb-4 sm:mb-5">
                  <p
                    className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}
                  >
                    Nom
                  </p>
                  <TextField
                    fullWidth
                    placeholder="Votre nom"
                    variant="outlined"
                    size="medium"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="transition-all duration-300"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "#334155" : "#fff",
                        color: darkMode ? "#fff" : "#111827",
                        "& fieldset": {
                          borderColor: darkMode ? "#475569" : "#e5e7eb",
                        },
                        "&:hover fieldset": {
                          borderColor: darkMode ? "#64748b" : "#9ca3af",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: darkMode ? "#60a5fa" : "#1a1a1a",
                        },
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: darkMode ? "#94a3b8" : "#9ca3af",
                        opacity: 1,
                      },
                    }}
                  />
                </div>

                {/* Prénom */}
                <div className="mb-4 sm:mb-5">
                  <p
                    className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}
                  >
                    Prénom
                  </p>
                  <TextField
                    fullWidth
                    placeholder="Votre prénom"
                    variant="outlined"
                    size="medium"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "#334155" : "#fff",
                        color: darkMode ? "#fff" : "#111827",
                        "& fieldset": {
                          borderColor: darkMode ? "#475569" : "#e5e7eb",
                        },
                        "&:hover fieldset": {
                          borderColor: darkMode ? "#64748b" : "#9ca3af",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: darkMode ? "#60a5fa" : "#1a1a1a",
                        },
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: darkMode ? "#94a3b8" : "#9ca3af",
                        opacity: 1,
                      },
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                  {/* Rang */}
                  <div className="mb-4 sm:mb-5">
                    <p
                      className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}
                    >
                      Rang
                    </p>
                    <FormControl fullWidth size="medium">
                      <InputLabel
                        sx={{
                          color: darkMode ? "#94a3b8" : "#6b7280",
                          "&.Mui-focused": {
                            color: darkMode ? "#60a5fa" : "#1a1a1a",
                          },
                        }}
                      >
                        Rang
                      </InputLabel>
                      <Select
                        label="Rang"
                        value={idRang}
                        onChange={(e) => setIdRang(e.target.value as number | "")}
                        sx={{
                          borderRadius: "12px",
                          backgroundColor: darkMode ? "#334155" : "#fff",
                          color: darkMode ? "#fff" : "#111827",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: darkMode ? "#475569" : "#e5e7eb",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: darkMode ? "#64748b" : "#9ca3af",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: darkMode ? "#60a5fa" : "#1a1a1a",
                          },
                        }}
                        MenuProps={{
                          slotProps: {
                            paper: {
                              sx: {
                                backgroundColor: darkMode ? "#334155" : "#fff",
                                color: darkMode ? "#fff" : "#111827",
                              },
                            },
                          },
                        }}
                      >
                        <MenuItem value={1}>Manager général</MenuItem>
                        <MenuItem value={2}>Manager équipe</MenuItem>
                        <MenuItem value={3}>Employé</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  {/* Poste */}
                  <div className="mb-4 sm:mb-5">
                    <p
                      className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}
                    >
                      Poste
                    </p>
                    <FormControl fullWidth size="medium">
                      <InputLabel
                        sx={{
                          color: darkMode ? "#94a3b8" : "#6b7280",
                          "&.Mui-focused": {
                            color: darkMode ? "#60a5fa" : "#1a1a1a",
                          },
                        }}
                      >
                        Poste occupé
                      </InputLabel>
                      <Select
                        label="Poste occupé"
                        value={idPoste}
                        onChange={(e) => setIdPoste(e.target.value as number | "")}
                        sx={{
                          borderRadius: "12px",
                          backgroundColor: darkMode ? "#334155" : "#fff",
                          color: darkMode ? "#fff" : "#111827",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: darkMode ? "#475569" : "#e5e7eb",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: darkMode ? "#64748b" : "#9ca3af",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: darkMode ? "#60a5fa" : "#1a1a1a",
                          },
                        }}
                        MenuProps={{
                          slotProps: {
                            paper: {
                              sx: {
                                backgroundColor: darkMode ? "#334155" : "#fff",
                                color: darkMode ? "#fff" : "#111827",
                              },
                            },
                          },
                        }}
                      >
                        <MenuItem value="">Aucun</MenuItem>
                        <MenuItem value={1}>Développeur</MenuItem>
                        <MenuItem value={2}>Marketeur</MenuItem>
                        <MenuItem value={3}>Support technique</MenuItem>
                        <MenuItem value={4}>Manager</MenuItem>
                        <MenuItem value={5}>Designer</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>

                {/* N+1 Assigner */}
                <div className="mb-4 sm:mb-5">
                  <p
                    className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}
                  >
                    N+1 Assigner
                  </p>
                  <FormControl fullWidth size="medium">
                    <InputLabel
                      sx={{
                        color: darkMode ? "#94a3b8" : "#6b7280",
                        "&.Mui-focused": {
                          color: darkMode ? "#60a5fa" : "#1a1a1a",
                        },
                      }}
                    >
                      Personne responsable
                    </InputLabel>
                    <Select
                      label="Personne responsable"
                      value={idManager}
                      onChange={(e) => setIdManager(String(e.target.value))}
                      sx={{
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "#334155" : "#fff",
                        color: darkMode ? "#fff" : "#111827",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#475569" : "#e5e7eb",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#64748b" : "#9ca3af",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkMode ? "#60a5fa" : "#1a1a1a",
                        },
                      }}
                      MenuProps={{
                        slotProps: {
                          paper: {
                            sx: {
                              backgroundColor: darkMode ? "#334155" : "#fff",
                              color: darkMode ? "#fff" : "#111827",
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="">Aucun</MenuItem>
                      <MenuItem value="1">Kage</MenuItem>
                      <MenuItem value="2">Henintsoa</MenuItem>
                      <MenuItem value="3">Panda</MenuItem>
                      <MenuItem value="4">Najo</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                {/* Date d'embauche */}
                <div className="mb-4 sm:mb-5">
                  <p
                    className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}
                  >
                    Date d'embauche
                  </p>
                  <TextField
                    fullWidth
                    type="date"
                    variant="outlined"
                    size="medium"
                    value={dateEmbauche}
                    onChange={(e) => setDateEmbauche(e.target.value)}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "#334155" : "#fff",
                        color: darkMode ? "#fff" : "#111827",
                        "& fieldset": {
                          borderColor: darkMode ? "#475569" : "#e5e7eb",
                        },
                        "&:hover fieldset": {
                          borderColor: darkMode ? "#64748b" : "#9ca3af",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: darkMode ? "#60a5fa" : "#1a1a1a",
                        },
                      },
                    }}
                  />
                </div>

                {/* Salaire */}
                <div className="mb-4 sm:mb-5">
                  <p
                    className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}
                  >
                    Salaire
                  </p>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Entrez le salaire annuel"
                    variant="outlined"
                    size="medium"
                    value={salaire}
                    onChange={(e) => setSalaire(e.target.value)}
                    slotProps={{
                      htmlInput: {
                        step: "0.01",
                        min: "0",
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "#334155" : "#fff",
                        color: darkMode ? "#fff" : "#111827",
                        "& fieldset": {
                          borderColor: darkMode ? "#475569" : "#e5e7eb",
                        },
                        "&:hover fieldset": {
                          borderColor: darkMode ? "#64748b" : "#9ca3af",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: darkMode ? "#60a5fa" : "#1a1a1a",
                        },
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: darkMode ? "#94a3b8" : "#9ca3af",
                        opacity: 1,
                      },
                    }}
                  />
                </div>
              </FormControl>
            </div>
          </Grid>

          {/* Right Side - Informations de compte */}
          <Grid size={{ xs: 12, md: 6 }}>
            <div
              className={`${cardBg} ${shadowClass} shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 h-full transition-all duration-300`}
            >
              <div className="text-center mb-6 md:mb-8">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 ${darkMode ? "bg-slate-700" : "bg-gray-100"} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300`}
                >
                  <span className="text-2xl sm:text-3xl">🔐</span>
                </div>
                <h2
                  className={`text-xl sm:text-2xl font-bold ${textPrimary} transition-colors duration-300`}
                >
                  Sécurité du compte
                </h2>
                <p
                  className={`${textSecondary} mt-2 text-sm sm:text-base transition-colors duration-300`}
                >
                  Informations de connexion
                </p>
              </div>

              <FormControl component="form" className="w-full" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-4 sm:mb-5">
                  <p
                    className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}
                  >
                    Email
                  </p>
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="exemple@email.com"
                    variant="outlined"
                    size="medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "#334155" : "#fff",
                        color: darkMode ? "#fff" : "#111827",
                        "& fieldset": {
                          borderColor: darkMode ? "#475569" : "#e5e7eb",
                        },
                        "&:hover fieldset": {
                          borderColor: darkMode ? "#64748b" : "#9ca3af",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: darkMode ? "#60a5fa" : "#1a1a1a",
                        },
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: darkMode ? "#94a3b8" : "#9ca3af",
                        opacity: 1,
                      },
                    }}
                  />
                </div>

                {/* Mot de passe */}
                <div className="mb-4 sm:mb-5">
                  <p
                    className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}
                  >
                    Mot de passe
                  </p>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe"
                    variant="outlined"
                    size="medium"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showPassword
                                  ? "Masquer le mot de passe"
                                  : "Afficher le mot de passe"
                              }
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                              sx={{ color: darkMode ? "#94a3b8" : "#6b7280" }}
                            >
                              {showPassword ? (
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.89 1 12c.73-2.06 1.96-3.88 3.5-5.31" />
                                  <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8a11.83 11.83 0 0 1-1.67 3.13" />
                                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                                  <path d="m1 1 22 22" />
                                </svg>
                              ) : (
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "#334155" : "#fff",
                        color: darkMode ? "#fff" : "#111827",
                        "& fieldset": {
                          borderColor: darkMode ? "#475569" : "#e5e7eb",
                        },
                        "&:hover fieldset": {
                          borderColor: darkMode ? "#64748b" : "#9ca3af",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: darkMode ? "#60a5fa" : "#1a1a1a",
                        },
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: darkMode ? "#94a3b8" : "#9ca3af",
                        opacity: 1,
                      },
                    }}
                  />
                </div>

                {/* Confirmation mot de passe */}
                <div className="mb-6 sm:mb-8">
                  <p
                    className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}
                  >
                    Confirmation mot de passe
                  </p>
                  <TextField
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez votre mot de passe"
                    variant="outlined"
                    size="medium"
                    value={confirmMotDePasse}
                    onChange={(e) => setConfirmMotDePasse(e.target.value)}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showConfirmPassword
                                  ? "Masquer la confirmation"
                                  : "Afficher la confirmation"
                              }
                              onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                              edge="end"
                              sx={{ color: darkMode ? "#94a3b8" : "#6b7280" }}
                            >
                              {showConfirmPassword ? (
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.89 1 12c.73-2.06 1.96-3.88 3.5-5.31" />
                                  <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8a11.83 11.83 0 0 1-1.67 3.13" />
                                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                                  <path d="m1 1 22 22" />
                                </svg>
                              ) : (
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "#334155" : "#fff",
                        color: darkMode ? "#fff" : "#111827",
                        "& fieldset": {
                          borderColor: darkMode ? "#475569" : "#e5e7eb",
                        },
                        "&:hover fieldset": {
                          borderColor: darkMode ? "#64748b" : "#9ca3af",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: darkMode ? "#60a5fa" : "#1a1a1a",
                        },
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: darkMode ? "#94a3b8" : "#9ca3af",
                        opacity: 1,
                      },
                    }}
                  />
                </div>

                {/* Bouton */}
                <Button
                  type="submit"
                  disabled={submitting || loading}
                  fullWidth
                  variant="contained"
                  className={`h-12! text-base! font-semibold! normal-case! mb-4! rounded-xl! transition-all! duration-300! ${btnHover}`}
                  sx={{
                    backgroundColor: darkMode ? "#475569" : "#1a1a1a",
                    "&:hover": {
                      backgroundColor: darkMode ? "#334155" : "#374151",
                    },
                  }}
                >
                  {submitting || loading ? "Inscription en cours..." : "S'inscrire"}
                </Button>

                {/* Lien connexion */}
                <p
                  className={`text-center text-sm ${textSecondary} transition-colors duration-300`}
                >
                  Déjà un compte ?{" "}
                  <a
                    href="/"
                    className={`${linkColor} font-semibold no-underline hover:underline transition-colors duration-300`}
                  >
                    Se connecter
                  </a>
                </p>
              </FormControl>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Signup;
