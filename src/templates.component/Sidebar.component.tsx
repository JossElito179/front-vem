import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth.modul/AuthProvider';
import { X } from 'lucide-react';
import { TbLayoutDashboard } from "react-icons/tb";
import { FaCalendarXmark } from "react-icons/fa6";
import { FaTasks } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaFingerprint } from "react-icons/fa";
import { FaArrowsDownToPeople } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";

interface SidebarProps {
  isCollapsed?: boolean;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  isMobile = false,
  onCloseMobile
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const displayName = user ? `${user.prenom} ${user.nom}` : '—';
  const displayRole = user?.poste?.libelle ?? user?.rang?.libelle ?? 'Employé';
  const initials = user
    ? `${user.nom.charAt(0)}${user.prenom.charAt(0)}`.toUpperCase()
    : 'U';
  const hasTeamPerm = user?.permissions.includes('VOIR_EQUIPE_PROPRE') ?? false;

  // Menu items configuration
  const allMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: TbLayoutDashboard,
      link: '/dashboard'
    },
    { 
      id: 'absence',
      label: 'Absence',
      icon: FaCalendarXmark,
      link: '/absence'
    },
    { 
      id: 'taches',
      label: 'Tâches',
      icon: FaTasks,
      link: '/tasks'
    },
    { 
      id: 'fiche-paie',
      label: 'Fiche de paie',
      icon: FaMoneyBillWave,
      link: '/paies/fisk'
    },
    { 
      id: 'pointeur',
      label: 'Pointeur',
      icon: FaFingerprint,
      link: '/pointeur'
    },
    { 
      id: 'parametrages',
      label: 'Paramétrages',
      icon: IoSettingsSharp,
      link: '/parametrages'
    },
    {
      id: 'n-1',
      label: 'N - 1',
      icon: FaArrowsDownToPeople,
      link: '/subordonnees',
      permission: 'VOIR_EQUIPE_PROPRE',
    },
  ];

  const menuItems = allMenuItems.filter(
    item => !item.permission || (item.permission === 'VOIR_EQUIPE_PROPRE' && hasTeamPerm)
  );

  // Déterminer l'élément actif basé sur la route actuelle
  const activeItem = useMemo(() => {
    const currentPath = location.pathname;
    const activeMenu = menuItems.find(item =>
      currentPath === item.link || currentPath.startsWith(item.link + '/')
    );
    return activeMenu?.id || 'dashboard';
  }, [location.pathname, menuItems]);

  return (
    <aside className={`
      h-screen flex flex-col justify-between relative
      bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800
      transition-all duration-300
      ${isCollapsed ? "w-20" : "w-64"}
      ${isMobile ? "fixed" : ""}
    `}>
      {/* Mobile close button */}
      {isMobile && onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="absolute top-4 right-4 z-50 p-2 rounded-lg
            bg-gray-100 dark:bg-gray-800
            text-gray-600 dark:text-gray-400
            hover:bg-red-100 dark:hover:bg-red-900/20
            hover:text-red-500 dark:hover:text-red-400
            transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header / Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-2"}`}>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {isCollapsed ? 'V' : 'Victus RH'}
          </span>
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-500 dark:text-gray-400">&lt;V&gt;</span>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 mt-6 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-1">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    navigate(item.link);
                    if (isMobile && onCloseMobile) onCloseMobile();
                  }}
                  className={`
                    group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-300 overflow-hidden
                    ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    }
                  `}
                >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                    )}
                    
                    <span className={`
                      relative z-10 text-xl transition-transform duration-300
                      ${isActive ? "scale-110" : "group-hover:scale-110"}
                    `}>
                      <IconComponent />
                    </span>
                    
                    {!isCollapsed && (
                      <span className="relative z-10 font-medium text-sm truncate">
                        {item.label}
                      </span>
                    )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / User Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}>
          <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0">
            {initials}
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{displayName}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{displayRole}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;