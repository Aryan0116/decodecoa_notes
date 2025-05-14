
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4 max-w-7xl animate-fade-in">
        <Outlet />
      </main>
      <footer className="border-t py-6 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Decode COA Notes © {new Date().getFullYear()} - A platform for Computer Organization and Architecture study materials</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
