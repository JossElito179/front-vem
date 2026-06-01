import { useState, useEffect } from "react";
import InsideSidebar from "../../templates.component/InsideSidebar.component";
import { IoMdFingerPrint } from "react-icons/io";
import {
  pointageEntree,
  pointageSortie,
  getStatutAujourdhui,
} from "../pointer.service";
import type { StatutAujourdhuiResponse } from "../pointer.interface";
import { MethodePointage as MethodePointageEnum } from "../pointer.interface";
import { useToast } from "../../components/Toast";

// Fonction utilitaire pour formater l'heure
const formatTime = (dateString: string | null | undefined): string => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "—";
    }
    const formatted = date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return formatted;
  } catch (e) {
    return "—";
  }
};

// Fonction pour vérifier si le bouton doit être désactivé
const isButtonDisabledByTime = (statut: StatutAujourdhuiResponse | null): boolean => {
  if (!statut) {
    return false;
  }
  
  // Si la journée est complète (entrée ET sortie enregistrées) → DÉSACTIVÉ
  if (statut.heureEntree && statut.heureSortie) {
    return true; // TOUJOURS désactivé si journée complète
  }
  
  return false;
};

const PointerComponent = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [statut, setStatut] = useState<StatutAujourdhuiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toastNotif = useToast();

  // Charger le statut du jour au montage
  useEffect(() => {
    loadStatut();
    const interval = setInterval(loadStatut, 60000); // Rafraîchir chaque minute
    return () => clearInterval(interval);
  }, []);

  const loadStatut = async () => {
    try {
      const data = await getStatutAujourdhui();
      setStatut(data);
      setError(null);
    } catch (err) {
      setError("Impossible de charger le statut");
    }
  };

  const handlePointerAction = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const isEntree = !statut?.aPointe;
      const now = new Date();
      const timeString = now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const payload = {
        methode: MethodePointageEnum.MANUEL,
        sourceDevice: "web",
      };

      let responseMessage = "";

      if (isEntree) {
        // Pointage d'ENTRÉE
        const response = await pointageEntree(payload as any);
        responseMessage = response.message || "Pointage d'entrée enregistré";
        setLastAction(`Entrée: ${timeString}`);
      } else {
        // Pointage de SORTIE
        const response = await pointageSortie(payload);
        responseMessage = response.message || "Pointage de sortie enregistré";
        setLastAction(`Sortie: ${timeString}`);
      }

      // Afficher le toast de succès
      toastNotif.success(responseMessage, {
        autoClose: 3000,
        hideProgressBar: false,
      });

      // Attendre un peu et recharger le statut
      setTimeout(async () => {
        await loadStatut();
      }, 500);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Erreur lors du pointage";
      setError(errorMessage);

      // Afficher le toast d'erreur
      toastNotif.error(errorMessage, {
        autoClose: 4000,
        hideProgressBar: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InsideSidebar>
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-t-xl border-t border border-gray-200/60 dark:border-gray-700/60 p-6 w-full">
        <div className="flex flex-col items-center justify-center px-4 select-none py-12 md:py-20">
          {/* Titre avec effet subtil */}
          <div className="text-center mb-12 md:mb-20">
            <h1 className="text-2xl md:text-5xl font-bold bg-linear-to-r from-gray-800 via-gray-600 to-gray-800 dark:from-gray-100 dark:via-gray-300 dark:to-gray-100 bg-clip-text text-transparent tracking-tight">
              Pointeur de présence
            </h1>
            <div className="mt-3 h-1 w-24 mx-auto rounded-full bg-linear-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400" />
          </div>

          {/* Affichage du statut du jour */}
          {statut && (
            <div className="mb-8 px-6 py-4 rounded-full bg-blue-50/80 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-700/50 w-full max-w-md">
              <div className="flex text-sm  items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Entrée</p>
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    {formatTime(statut.heureEntree)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Sortie</p>
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    {formatTime(statut.heureSortie)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className="mb-8 px-6 py-4 rounded-lg bg-red-50/80 dark:bg-red-900/30 border border-red-200/50 dark:border-red-700/50 w-full max-w-md">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Message si journée complète et avant 01:00:00 */}
          {/* {isButtonDisabledByTime(statut) && (
            <div className="mb-8 px-6 py-4 rounded-lg bg-amber-50/80 dark:bg-amber-900/30 border border-amber-200/50 dark:border-amber-700/50 w-full max-w-md">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                ⏳ Votre journée est complète. Pointage disponible à partir de 01:00:00
              </p>
            </div>
          )} */}

          {/* Zone du bouton principal */}
          <div className="relative group">
            {/* Halo d'animation */}
            <div
              className={`
                absolute inset-0 rounded-full blur-xl transition-all duration-500
                ${
                  isPressed
                    ? "bg-blue-500/30 dark:bg-blue-400/30 scale-110"
                    : "bg-gray-400/20 dark:bg-gray-500/20 scale-100 group-hover:scale-125 group-hover:bg-blue-400/20 dark:group-hover:bg-blue-300/20"
                }
              `}
            />

            {/* Anneau extérieur */}
            <div
              className={`
                absolute -inset-4 rounded-full border-2 border-dashed transition-all duration-700
                ${
                  isPressed
                    ? "border-blue-400/60 dark:border-blue-300/60 rotate-180 scale-105"
                    : "border-gray-300/40 dark:border-gray-600/40 group-hover:border-blue-300/50 dark:group-hover:border-blue-400/50 animate-[spin_10s_linear_infinite]"
                }
              `}
            />

            {/* Bouton principal */}
            <button
              onMouseDown={() => !isLoading && setIsPressed(true)}
              onMouseUp={() => {
                setIsPressed(false);
                handlePointerAction();
              }}
              onMouseLeave={() => setIsPressed(false)}
              onTouchStart={() => !isLoading && setIsPressed(true)}
              onTouchEnd={() => {
                setIsPressed(false);
                handlePointerAction();
              }}
              disabled={isLoading || isButtonDisabledByTime(statut)}
              className={`
                relative flex flex-col items-center justify-center
                w-36 h-36 md:w-44 md:h-44
                rounded-full
                transition-all duration-300 ease-out
                cursor-pointer
                focus:outline-none focus:ring-4 focus:ring-offset-2 
                focus:ring-blue-500/30 dark:focus:ring-blue-400/30
                focus:ring-offset-white dark:focus:ring-offset-gray-900
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  isPressed
                    ? "scale-90 bg-linear-to-br from-blue-600 to-purple-700 dark:from-blue-500 dark:to-purple-600 shadow-2xl shadow-blue-500/40 dark:shadow-blue-400/30"
                    : "bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 shadow-xl shadow-gray-300/50 dark:shadow-black/50 hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20 hover:scale-105"
                }
              `}
              aria-label="Pointer pour Entrer/Sortir"
            >
              {isLoading ? (
                <div className="animate-spin">
                  <IoMdFingerPrint
                    className={`
                      w-20 h-20 md:w-24 md:h-24
                      text-white
                    `}
                  />
                </div>
              ) : (
                <>
                  <IoMdFingerPrint
                    className={`
                      w-16 h-16 md:w-20 md:h-20
                      transition-all duration-300
                      ${
                        isPressed
                          ? "text-white scale-110"
                          : "text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300"
                      }
                    `}
                  />
                  <span
                    className={`
                    text-xs md:text-sm font-bold mt-2
                    ${isPressed ? "text-white" : "text-gray-600 dark:text-gray-300"}
                  `}
                  >
                    { isButtonDisabledByTime(statut) ? '' : statut?.aPointe ? "SORTIE" : "ENTRÉE"}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Texte d'instruction */}
          <p className="mt-12 md:mt-20 text-base md:text-lg text-gray-600 dark:text-gray-400 text-center font-medium tracking-wide">
            <span className="inline-flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isButtonDisabledByTime(statut)
                    ? "bg-amber-500 dark:bg-amber-400"
                    : statut?.aPointe
                      ? "bg-orange-500 dark:bg-orange-400"
                      : "bg-green-500 dark:bg-green-400"
                } animate-pulse`}
              />
              {isButtonDisabledByTime(statut)
                ? "Pointage indisponible"
                : statut?.aPointe
                  ? "Cliquez pour votre Sortie"
                  : "Cliquez pour votre Entrée"}
            </span>
          </p>

          {/* Affichage du dernier pointage */}
          {lastAction && (
            <div className="mt-6 px-5 py-3 rounded-2xl bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200/50 dark:border-gray-700/50 shadow-lg animate-[fadeIn_0.5s_ease-out]">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Dernier pointage
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                {lastAction}
              </p>
            </div>
          )}

          {/* Indicateur de statut */}
          <div className="mt-8 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${isLoading ? "bg-yellow-500 dark:bg-yellow-400 animate-pulse" : "bg-green-500 dark:bg-green-400"}`}
              />
              <span>{isLoading ? "Traitement..." : "Prêt"}</span>
            </div>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span>Système actif</span>
          </div>
        </div>
      </div>
    </InsideSidebar>
  );
};

export default PointerComponent;
