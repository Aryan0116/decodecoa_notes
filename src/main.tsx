
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MainLoader } from './components/ui/main-loader.tsx';

const Root = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Show loader for 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {loading && <MainLoader />}
      <App />
    </>
  );
};

document.documentElement.classList.add('light'); // Ensure light mode by default
createRoot(document.getElementById("root")!).render(<Root />);
