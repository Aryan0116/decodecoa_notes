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
          <p className="mt-2 flex items-center justify-center gap-1">
            Created with love by Decode COA Team 
            <span className="text-red-500 animate-pulse inline-block" style={{
              animation: 'heartbeat 1.5s ease-in-out infinite'
            }}>
              ❤️
            </span>
          </p>
        </div>
        <style jsx>{`
          @keyframes heartbeat {
            0% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(1); }
            75% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}</style>
      </footer>
    </div>
  );
};

export default Layout;