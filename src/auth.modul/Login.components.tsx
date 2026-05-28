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
  const { success, error, warning } = useToast();
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

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
        <div className="items-center flex h-screen justify-center">
          loading...
        </div>
      ) : (
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
                      <form action="" method="post" onSubmit={handleSubmit}>
                        <div className="form-control flex flex-col mt-5">
                          <p className="text-start mb-2">
                            <label htmlFor="email"> Email</label>
                          </p>
                          <TextField
                            id="outlined-basic"
                            className="mt-10"
                            label="📧 Adresse email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="form-control flex flex-col mt-5">
                          <p className="text-start mb-2">
                            <label htmlFor="username"> Mots de passe</label>
                          </p>
                          <TextField
                            id="outlined-basic"
                            className="mt-10"
                            label=" 🔑 Entrer le mdp"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="button-container mt-10">
                          <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-gray-900! text-white!"
                          >
                            Se connecter
                          </Button>
                        </div>
                        <p
                          className="mt-5"
                          style={{
                            textAlign: "center",
                            color: "#666",
                            fontSize: "14px",
                          }}
                        >
                          Pas de compte ?{" "}
                          <a
                            href="/signup"
                            style={{
                              color: "#1a1a1a",
                              fontWeight: "600",
                              textDecoration: "none",
                            }}
                          >
                            S'inscrire
                          </a>
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid size={6}>
                <div
                  style={{
                    height: "100%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "20px",
                    padding: "40px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "32px",
                      marginBottom: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    Bienvenue !
                  </h2>
                  <p
                    style={{
                      fontSize: "18px",
                      marginBottom: "30px",
                      opacity: 0.9,
                    }}
                  >
                    Plateforme de gestion d'employees
                  </p>
                  <div
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      borderRadius: "10px",
                      padding: "20px",
                      width: "100%",
                    }}
                  >
                    <p style={{ marginBottom: "10px" }}>✓ Accès local</p>
                    <p style={{ marginBottom: "10px" }}>
                      ✓ Checkeur et dashboard
                    </p>
                    <p>✓ Fonctionnalités de gestion</p>
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
