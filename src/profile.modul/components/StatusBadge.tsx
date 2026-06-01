

const StatusBadge = ({ user }: { user: { estActif: boolean } }) => {
    return (
        <>
            <div className="pb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                  user.estActif
                    ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${user.estActif ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                />
                {user.estActif ? "Actif" : "Inactif"}
              </span>
            </div>
        </>
    );
}

export default StatusBadge;