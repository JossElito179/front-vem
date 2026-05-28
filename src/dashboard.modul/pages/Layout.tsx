import React from 'react';
import Header from '../../templates.component/Headers.component';
// import Sidebar from '../../templates.component/Sidebar.component';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="">
      <Header />
      <main className="ml-64 pt-20 text-start!">
        <div className="">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;