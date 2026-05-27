import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../templates.component/Headers.component';
import { useAuth } from '../../auth.modul/AuthProvider';
// import Sidebar from '../../templates.component/Sidebar.component';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="">
      <Header onLogoutRequest={handleLogout} />
      <main className="ml-64 pt-20 text-start!">
        <div className="">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;