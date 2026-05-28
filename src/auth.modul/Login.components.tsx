import { Button, Grid, TextField } from "@mui/material";
import logo from "../assets/logo_complete.jpeg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../components/Toast.tsx";
import { useAuth } from "./AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const { success, error, warning } = useToast();
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Classes conditionnelles selon le thème
  const bgClass = darkMode ? "bg-slate-900" : "bg-gray-50";
  const cardBg = darkMode ? "bg-slate-800" : "bg-white";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-400" : "text-gray-600";
  const textLabel = darkMode ? "text-gray-300" : "text-gray-700";
  const shadowClass = darkMode ? "shadow-slate-900/30" : "shadow-gray-200/50";
  const btnHover = darkMode ? "hover:bg-slate-600" : "hover:bg-gray-800";
  const linkColor = darkMode ? "text-blue-400" : "text-gray-900";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      warning("Veuillez renseigner l'email et le mot de passe.", {
        position: "top-center",
      });
      return;
    }

    try {
      await login(email, password);
      success("Connexion réussie.", {
        position: "top-right",
      });
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Identifiants incorrects.";

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
    }
  };

  return (
    <>
      {loading || isAuthenticated ? (
        <div
          className={`${bgClass} flex h-screen items-center justify-center transition-colors duration-300`}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${darkMode ? "border-blue-400" : "border-gray-900"}`}
            ></div>
            <span className={`${textSecondary} text-sm`}>Chargement...</span>
          </div>
        </div>
      ) : (
        <div
          className={`${bgClass} min-h-screen flex items-center justify-center transition-colors duration-300`}
        >
          {/* Toggle Dark/Light */}
          <button
            onClick={toggleTheme}
            className={`fixed top-4 right-4 p-3 rounded-full ${cardBg} ${shadowClass} shadow-lg transition-all duration-300 hover:scale-110 z-50`}
            title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {darkMode ? (
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {/* Left Side - Formulaire de connexion */}
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
                      Connexion
                    </h1>
                    <p
                      className={`${textSecondary} mt-2 text-sm sm:text-base transition-colors duration-300`}
                    >
                      Accédez à votre compte
                    </p>
                  </div>

                  <div className="w-full">
                    <form onSubmit={handleSubmit} className="w-full">
                      <div className="mb-4 sm:mb-5">
                        <p
                          className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}
                        >
                          Email
                        </p>
                        <TextField
                          fullWidth
                          id="email"
                          label="📧 Adresse email"
                          variant="outlined"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "transparent",
                              color: darkMode ? "#fff" : "#111827",
                              "&.Mui-focused": {
                                backgroundColor: "transparent",
                              },
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
                            "& .MuiInputLabel-root": {
                              color: darkMode ? "#94a3b8" : "#6b7280",
                              "&.Mui-focused": {
                                color: darkMode ? "#60a5fa" : "#1a1a1a",
                              },
                            },
                            "& .MuiInputBase-input::placeholder": {
                              color: darkMode ? "#94a3b8" : "#9ca3af",
                              opacity: 1,
                            },
                          }}
                        />
                      </div>

                      <div className="mb-6 sm:mb-8">
                        <p
                          className={`text-left mb-2 font-medium ${textLabel} text-sm sm:text-base transition-colors duration-300`}
                        >
                          Mot de passe
                        </p>
                        <TextField
                          fullWidth
                          id="password"
                          label="🔑 Entrer le mot de passe"
                          variant="outlined"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "transparent",
                              color: darkMode ? "#fff" : "#111827",
                              "&.Mui-focused": {
                                backgroundColor: "transparent",
                              },
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
                            "& .MuiInputLabel-root": {
                              color: darkMode ? "#94a3b8" : "#6b7280",
                              "&.Mui-focused": {
                                color: darkMode ? "#60a5fa" : "#1a1a1a",
                              },
                            },
                            "& .MuiInputBase-input::placeholder": {
                              color: darkMode ? "#94a3b8" : "#9ca3af",
                              opacity: 1,
                            },
                          }}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        fullWidth
                        variant="contained"
                        className={`h-12! text-base! font-semibold! normal-case! mb-4! rounded-xl! transition-all! duration-300! ${btnHover}`}
                        sx={{
                          backgroundColor: darkMode ? "#475569" : "#1a1a1a",
                          "&:hover": {
                            backgroundColor: darkMode ? "#334155" : "#374151",
                          },
                          "&.Mui-disabled": {
                            backgroundColor: darkMode ? "#475569" : "#9ca3af",
                            color: darkMode ? "#cbd5e1" : "#fff",
                          },
                        }}
                      >
                        {loading ? "Connexion en cours..." : "Se connecter"}
                      </Button>

                      <p
                        className={`text-center text-sm ${textSecondary} transition-colors duration-300`}
                      >
                        Pas de compte ?{" "}
                        <a
                          href="/signup"
                          className={`${linkColor} font-semibold no-underline hover:underline transition-colors duration-300`}
                        >
                          S'inscrire
                        </a>
                      </p>
                    </form>
                  </div>
                </div>
              </Grid>

              {/* Right Side - Bannière d'accueil */}
              <Grid size={{ xs: 12, md: 6 }}>
                <div
                  className={`h-full rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col justify-center items-center text-white text-center transition-all duration-300 ${
                    darkMode
                      ? "bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600"
                      : "bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500"
                  }`}
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                    Bienvenue !
                  </h2>
                  <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90">
                    Plateforme de gestion d'employés
                  </p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 w-full max-w-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-green-400 text-lg">✓</span>
                      <p className="text-sm sm:text-base">Accès local</p>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-green-400 text-lg">✓</span>
                      <p className="text-sm sm:text-base">
                        Checkeur et dashboard
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-400 text-lg">✓</span>
                      <p className="text-sm sm:text-base">
                        Fonctionnalités de gestion
                      </p>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
