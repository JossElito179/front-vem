import { useEffect, useState } from 'react';
import { Users, Mail, Shield, Briefcase } from 'lucide-react';
import { toast } from 'react-toastify';
import { getSubordonnees } from '../../auth.modul/auth.service';
import type { SubordonneeUser } from '../../auth.modul/auth.service';
import InsideSidebar from '../../templates.component/InsideSidebar.component';

const AVATAR_COLORS = [
  'bg-blue-600', 'bg-green-600', 'bg-purple-600',
  'bg-red-600',  'bg-orange-500', 'bg-teal-600',
];

function avatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function initials(nom: string, prenom: string) {
  return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase();
}

type CardProps = { user: SubordonneeUser };

const SubordonneeCard = ({ user }: CardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
    <div
      className={`w-12 h-12 rounded-full ${avatarColor(user.id)} flex items-center justify-center text-white font-bold text-base shrink-0`}
    >
      {initials(user.nom, user.prenom)}
    </div>

    <div className="min-w-0 flex-1">
      <p className="font-semibold text-slate-900 dark:text-white truncate">
        {user.prenom} {user.nom}
      </p>

      <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-gray-400 truncate">
        <Mail size={12} className="shrink-0" />
        <span className="truncate">{user.email}</span>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {user.rang && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            <Shield size={10} />
            {user.rang.libelle}
          </span>
        )}
        {user.poste && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
            <Briefcase size={10} />
            {user.poste.rolePredefini}
          </span>
        )}
      </div>
    </div>
  </div>
);

const SubordonneePageContent = () => {
  const [users, setUsers] = useState<SubordonneeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSubordonnees();
        setUsers(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Impossible de charger les subordonnés';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  return (
    <div className="p-4 md:p-6">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <Users className="text-blue-600 dark:text-blue-500 shrink-0" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mon équipe</h1>
          {!loading && !error && (
            <p className="text-sm text-slate-500 dark:text-gray-400">
              {users.length} membre{users.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <Shield size={40} className="text-red-400 opacity-60" />
          <p className="text-slate-600 dark:text-gray-300 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400 dark:text-gray-500">
          <Users size={40} className="opacity-40" />
          <p>Aucun subordonné trouvé</p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {users.map(user => (
            <SubordonneeCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

const SubordonneesPage = () => (
  <InsideSidebar>
    <SubordonneePageContent />
  </InsideSidebar>
);

export default SubordonneesPage;
