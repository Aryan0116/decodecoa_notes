import React, { useEffect, useState } from "react";
import { BookOpen, Notebook, FileText, Users, Pencil, BookmarkPlus } from "lucide-react";

const NotesLoader = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Animate progress from 0 to 100 over 3 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 60); // ~50 steps over 3 seconds
    
    // Hide loader after 3.5 seconds
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3500);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);
  
  if (!showLoader) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-all duration-500">
      <div className="relative flex flex-col items-center">
        {/* Animated notebook icon with floating elements */}
        <div className="relative h-48 w-48 flex items-center justify-center mb-6">
          {/* Circling elements */}
          <div className="absolute w-full h-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 transform">
              <BookOpen className="w-8 h-8 text-blue-500 animate-bounce" />
            </div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 transform">
              <FileText className="w-8 h-8 text-green-500 animate-pulse" />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 transform">
              <Users className="w-8 h-8 text-purple-500 animate-bounce" />
            </div>
            <div className="absolute top-1/2 left-0 -translate-y-1/2 transform">
              <Pencil className="w-8 h-8 text-amber-500 animate-pulse" />
            </div>
            
            {/* Spinning rings */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-300 opacity-50 animate-spin" style={{ animationDuration: '10s' }}></div>
            <div className="absolute inset-4 rounded-full border-4 border-dashed border-green-300 opacity-50 animate-spin" style={{ animationDuration: '8s' }}></div>
          </div>
          
          {/* Central notebook icon */}
          <div className="relative z-10">
            <div className="relative">
              <Notebook className="w-20 h-20 text-blue-600" />
              <BookmarkPlus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-green-600 animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Text content */}
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
          DECODE CO-A NOTES
        </h2>
        
        <p className="text-muted-foreground animate-pulse mb-4">
          Connecting minds through shared knowledge...
        </p>
        
        {/* Progress bar */}
        <div className="w-64 bg-gray-200 rounded-full h-2 dark:bg-gray-700 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-100 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export { NotesLoader as MainLoader };