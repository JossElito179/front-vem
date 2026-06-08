import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { StatsPersonnellesResponse } from "../dashboard.interface";
import { getStatsPersonnelles } from "../dashboard.service";
import {
  AlertTriangleIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  HistoryIcon,
  TrendingUpIcon,
} from "./DashboardIcons";

const DashboardComponent = () => {
  const [stats, setStats] = useState<StatsPersonnellesResponse | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatTime = (isoDate: string) =>
    new Date(isoDate).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        setStatsError(null);
        const data = await getStatsPersonnelles();
        setStats(data);
      } catch (error: any) {
        setStatsError(
          error?.message || "Erreur de chargement des statistiques.",
        );
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  // Composant pour la barre de progression circulaire
  const CircularProgress = ({
    value,
    max,
    size = 120,
    strokeWidth = 8,
    color = "#3b82f6",
    label,
  }: {
    value: number;
    max: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label: string;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = Math.min((value / max) * 100, 100);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {loadingStats ? "..." : `${Math.round(percentage)}%`}
            </span>
          </div>
        </div>
        <span className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </span>
      </div>
    );
  };

  // Badge de statut coloré
  const StatusBadge = ({ statut }: { statut: string }) => {
    const configs: Record<string, { bg: string; text: string; label: string }> =
      {
        present: {
          bg: "bg-emerald-100 dark:bg-emerald-900/30",
          text: "text-emerald-700 dark:text-emerald-400",
          label: "Présent",
        },
        retard: {
          bg: "bg-amber-100 dark:bg-amber-900/30",
          text: "text-amber-700 dark:text-amber-400",
          label: "Retard",
        },
        absent: {
          bg: "bg-rose-100 dark:bg-rose-900/30",
          text: "text-rose-700 dark:text-rose-400",
          label: "Absent",
        },
      };
    const config = configs[statut] || {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-700 dark:text-gray-300",
      label: statut,
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  // Skeleton loader
  const Skeleton = ({ className = "" }: { className?: string }) => (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    />
  );

  return (
    <div className="w-full mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <CalendarIcon />
            {stats ? (
              <span>
                {new Date(stats.annee, stats.mois - 1).toLocaleDateString(
                  "fr-FR",
                  { month: "long", year: "numeric" },
                )}
              </span>
            ) : (
              <Skeleton className="w-32 h-4" />
            )}
          </p>
        </div>
        {stats?.pointagesSuspects && stats.pointagesSuspects > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <AlertTriangleIcon />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
              {stats.pointagesSuspects} pointage
              {stats.pointagesSuspects > 1 ? "s" : ""} suspect
              {stats.pointagesSuspects > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {statsError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
          <AlertTriangleIcon />
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            {statsError}
          </p>
        </div>
      )}

      {/* Stats Grid - Layout amélioré avec 4 colonnes sur desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Carte Jours Présents */}
        <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-linear-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-800/50 border border-blue-100 dark:border-blue-900/30 hover:shadow-lg dark:hover:shadow-blue-900/10 transition-all duration-300 group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircleIcon />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <CheckCircleIcon />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Jours présents
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
              {loadingStats ? (
                <Skeleton className="w-16 h-10" />
              ) : (
                (stats?.totalJoursPresents ?? 0)
              )}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              / {stats?.joursOuvrables ?? 0} jours
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(((stats?.totalJoursPresents ?? 0) / (stats?.joursOuvrables || 1)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Carte Retards */}
        <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-linear-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-gray-800/50 border border-amber-100 dark:border-amber-900/30 hover:shadow-lg dark:hover:shadow-amber-900/10 transition-all duration-300 group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <ClockIcon />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
              <ClockIcon />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Retards
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
              {loadingStats ? (
                <Skeleton className="w-16 h-10" />
              ) : (
                (stats?.totalRetards ?? 0)
              )}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ce mois
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
            <TrendingUpIcon />
            <span>
              {stats?.totalRetards
                ? `${stats.totalRetards} retard${stats.totalRetards > 1 ? "s" : ""} enregistré${stats.totalRetards > 1 ? "s" : ""}`
                : "Aucun retard"}
            </span>
          </div>
        </div>

        {/* Carte Temps de travail */}
        <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-linear-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-800/50 border border-purple-100 dark:border-purple-900/30 hover:shadow-lg dark:hover:shadow-purple-900/10 transition-all duration-300 group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <ClockIcon />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
              <ClockIcon />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Temps travaillé
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
              {loadingStats ? (
                <Skeleton className="w-16 h-10" />
              ) : (
                formatDuration(stats?.totalMinutesTravail ?? 0)
              )}
            </h2>
          </div>
          <div className="mt-3 text-xs text-purple-600 dark:text-purple-400">
            {stats?.totalHeuresTravail
              ? `${stats.totalHeuresTravail}h au total`
              : "Ce mois-ci"}
          </div>
        </div>

        {/* Carte Taux d'assiduité avec cercle */}
        <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-linear-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-gray-800/50 border border-emerald-100 dark:border-emerald-900/30 hover:shadow-lg dark:hover:shadow-emerald-900/10 transition-all duration-300 group">
          <div className="flex flex-col items-center justify-center h-full">
            <CircularProgress
              value={stats?.tauxAssiduite ?? 0}
              max={100}
              size={100}
              strokeWidth={6}
              color={
                (stats?.tauxAssiduite ?? 0) >= 90
                  ? "#10b981"
                  : (stats?.tauxAssiduite ?? 0) >= 70
                    ? "#f59e0b"
                    : "#ef4444"
              }
              label="Taux d'assiduité"
            />
          </div>
        </div>
      </div>

      {/* Section Historique */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
              <HistoryIcon />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                Historique des pointages
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats?.historique?.length ?? 0} entrée
                {stats?.historique && stats.historique.length > 1 ? "s" : ""} ce
                mois
              </p>
            </div>
          </div>
        </div>

        {/* Table améliorée */}
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <TableContainer
            component={Paper}
            className="shadow-none! dark:bg-gray-800!"
          >
            <Table
              sx={{ minWidth: 650 }}
              aria-label="historique des pointages"
              size="small"
            >
              <TableHead>
                <TableRow className="bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur">
                  <TableCell className="font-semibold! dark:text-gray-100! py-4!">
                    Date & Heure
                  </TableCell>
                  <TableCell className="font-semibold! dark:text-gray-100! py-4!">
                    Méthode
                  </TableCell>
                  <TableCell className="font-semibold! dark:text-gray-100! py-4! hidden sm:table-cell">
                    Durée du travail
                  </TableCell>
                  <TableCell className="font-semibold! dark:text-gray-100! py-4! hidden md:table-cell">
                    Retard
                  </TableCell>
                  <TableCell
                    align="right"
                    className="font-semibold! dark:text-gray-100! py-4!"
                  >
                    Statut
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingStats
                  ? // Loading skeletons
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="w-32 h-4" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-20 h-4" />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Skeleton className="w-16 h-4" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="w-16 h-4" />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton className="w-20 h-6 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  : (stats?.historique ?? []).map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors group"
                      >
                        <TableCell component="th" scope="row">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(row.debutCheckin)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {formatTime(row.debutCheckin)} -{" "}
                              {row.finCheckin
                                ? formatTime(row.finCheckin)
                                : "En cours"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                            {row.methode}
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {row.dureeTravail
                              ? formatDuration(row.dureeTravail)
                              : "—"}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {row.estRetard ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                              <ClockIcon />
                              {row.minutesRetard} min
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <StatusBadge statut={row.statut} />
                        </TableCell>
                      </TableRow>
                    ))}
                {!loadingStats &&
                  (!stats?.historique || stats.historique.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full">
                            <HistoryIcon />
                          </div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Aucune donnée historique disponible
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Les pointages de ce mois apparaîtront ici
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
