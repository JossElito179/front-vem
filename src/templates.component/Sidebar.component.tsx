import React, { useState } from 'react';
import { TbLayoutDashboard } from "react-icons/tb";
import { FaCalendarXmark } from "react-icons/fa6";
import { FaTasks } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaFingerprint } from "react-icons/fa";
import { FaArrowsDownToPeople } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";

const Sidebar = ( { id }: { id: string }) => {
  console.log(id)
  const [activeItem, setActiveItem] = useState(id);

  const menuItems = [
    {
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: TbLayoutDashboard,  // ← Référence au composant, pas string
      link: '/dashboard'
    },
    { 
      id: 'absence', 
      label: 'Absence', 
      icon: FaCalendarXmark, 
      link: '/abscence/list'  // ← Correction de l'orthographe
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
      link: '/subordonnees'  // ← Correction du path
    },
  ];

  return (
    <aside className="w-64 bg-gray-100 text-gray-800 h-screen fixed shadow-xl left-0 top-0 flex flex-col">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-900">Victus</span>
          <span className="text-xl font-bold text-gray-500">&lt;V&gt;</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 mt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;  // ← Récupère le composant icône
            return (
              <li key={item.id}>  {/* ← key sur le li */}
                <a href={item.link}>  {/* ← a à l'intérieur du li */}
                  <button
                    onClick={() => setActiveItem(item.id)}
                    className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors duration-200 ${
                      activeItem === item.id
                        ? 'bg-gray-200 text-gray-900 border-l-4 border-orange-600'
                        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-xl">
                      <IconComponent />  {/* ← Utilisation correcte de l'icône */}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">USER 100</p>
            <p className="text-xs text-gray-600">Employé</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;