import { useEffect, useState } from "react";
import type { User } from "../interface";
import { getUserProfile, validatePasswordForSalary } from "../profile.service";
import InsideSidebar from "../../templates.component/InsideSidebar.component";
import StatusBadge from "../components/StatusBadge";
import PasswordModal from "../components/PasswordModal ";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSalary, setShowSalary] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isValidatingPassword, setIsValidatingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserProfile();
        setUser(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleRequestShowSalary = () => {
    setPasswordError(null);
    setIsPasswordModalOpen(true);
  };

  const handleValidatePassword = async (password: string) => {
    setIsValidatingPassword(true);
    setPasswordError(null);

    try {
      const isValid = await validatePasswordForSalary(password);

      if (isValid) {
        setShowSalary(true);
        setIsPasswordModalOpen(false);
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Erreur lors de la validation";
      setPasswordError(errorMsg);
    } finally {
      setIsValidatingPassword(false);
    }
  };

  if (loading) {
    return (
      <InsideSidebar>
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
            <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
              Chargement du profil...
            </p>
          </div>
        </div>
      </InsideSidebar>
    );
  }

  if (error) {
    return (
      <InsideSidebar>
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-100 dark:border-red-900">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-red-800 dark:text-red-400 font-bold text-lg">
                Erreur
              </h3>
            </div>
            <p className="text-red-600 dark:text-red-300 leading-relaxed">
              {error}
            </p>
          </div>
        </div>
      </InsideSidebar>
    );
  }

  if (!user) {
    return (
      <InsideSidebar>
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Aucune donnée disponible
            </p>
          </div>
        </div>
      </InsideSidebar>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const InfoCard = ({
    icon,
    label,
    value,
    highlight = false,
    hideable = false,
    isHidden = false,
    onToggleHide,
  }: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    highlight?: boolean;
    hideable?: boolean;
    isHidden?: boolean;
    onToggleHide?: () => void;
  }) => (
    <div
      className={`group p-4 rounded-xl border transition-all duration-300 hover:shadow-md relative ${
        highlight
          ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
          : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
            highlight
              ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
              : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
          } transition-colors`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            {label}
          </p>
          <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {hideable && isHidden ? "••••••" : value}
          </div>
        </div>
        {hideable && (
          <button
            onClick={onToggleHide}
            className="shrink-0 ml-2 p-1.5 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={isHidden ? "Afficher le salaire" : "Masquer le salaire"}
          >
            {isHidden ? (
              <svg
                className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.573-10.036A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.064 10.064 0 01-5.891 5.891"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );

  const SectionTitle = ({
    icon,
    title,
  }: {
    icon: React.ReactNode;
    title: string;
  }) => (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-lg flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
    </div>
  );

  return (
    <InsideSidebar>
      <div className="h-screen bg-transparent dark:bg-transparent p-4 md:p-2">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Mon Profil
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm md:text-base">
                Gérez vos informations personnelles et professionnelles
              </p>
            </div>
            <button className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Modifier le profil
            </button>
          </div>

          {/* Profile Hero Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex items-center gap-6 p-6 md:p-8">
            {/* Name & Role */}
            <div className="text-center md:text-left flex-1 pb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {user.prenom} {user.nom}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 flex items-center justify-center md:justify-start gap-2">
                <svg
                  className="w-4 h-4 text-blue-500 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {user.rang?.libelle || "Utilisateur"}
              </p>
            </div>

            {/* Status Badge */}
            <StatusBadge user={user} />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
              <SectionTitle
                icon={
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
                title="Informations Personnelles"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  label="Email"
                  value={user.email}
                />
                <InfoCard
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  }
                  label="Téléphone"
                  value={user.telephone}
                />
                <InfoCard
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  label="Date de Naissance"
                  value={formatDate(user.dateNaissance)}
                />
                <InfoCard
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  label="Date d'Embauche"
                  value={formatDate(user.dateEmbauche)}
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
              <SectionTitle
                icon={
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
                title="Informations Professionnelles"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                  label="Salaire"
                  value={`${parseFloat(user.salaire).toLocaleString("fr-FR")} MGA`}
                  highlight
                  hideable
                  isHidden={!showSalary}
                  onToggleHide={() => {
                    if (showSalary) {
                      setShowSalary(false);
                    } else {
                      handleRequestShowSalary();
                    }
                  }}
                />
                <InfoCard
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  }
                  label="Rang"
                  value={
                    <span>
                      {user.rang?.libelle || "Non défini"}
                      {user.rang?.niveau && (
                        <span className="text-gray-400 dark:text-gray-500 text-xs ml-1.5 font-normal">
                          Niv. {user.rang.niveau}
                        </span>
                      )}
                    </span>
                  }
                />
                <InfoCard
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  }
                  label="Poste"
                  value={
                    user.intitulePersonnalise ||
                    user.poste?.libelle ||
                    "Non défini"
                  }
                />
                <InfoCard
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  }
                  label="Manager"
                  value={
                    user.manager
                      ? `${user.manager.prenom} ${user.manager.nom}`
                      : "Pas de manager"
                  }
                />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
            <SectionTitle
              icon={
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              }
              title="Mes Permissions"
            />
            {user.rang?.permissions && user.rang.permissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {user.rang.permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300"
                  >
                    <div className="shrink-0 w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {permission.code}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <svg
                  className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <p className="text-gray-400 dark:text-gray-500 font-medium">
                  Aucune permission assignée
                </p>
              </div>
            )}
          </div>

          {/* Footer Metadata */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  Créé le{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {formatDate(user.createdAt)}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Dernière modification{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {formatDate(user.updatedAt)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Password Modal */}
        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => {
            setIsPasswordModalOpen(false);
            setPasswordError(null);
          }}
          onConfirm={handleValidatePassword}
          title="Accéder au salaire"
          description="Veuillez saisir votre mot de passe pour afficher votre salaire"
          confirmLabel="Afficher"
          cancelLabel="Annuler"
          isLoading={isValidatingPassword}
          error={passwordError}
        />
      </div>
    </InsideSidebar>
  );
};

export default Profile;
