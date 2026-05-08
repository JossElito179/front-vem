import React, { useState } from 'react';

const Header = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-gray-100 shadow-sm border-b border-gray-200 fixed top-0 right-0 left-64 z-10">
      <div className="px-6 py-3 flex justify-between items-center">
        <div className='text-start'>
          <h2 className=" text-2xl! font-semibold text-gray-800">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Bienvenue sur votre espace de travail
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                U
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">USER 100</p>
                <p className="text-xs text-gray-500">Administrateur</p>
              </div>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                   Mon profil
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  ⚙️ Paramètres
                </a>
                <hr className="my-1" />
                <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  🚪 Déconnexion
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;