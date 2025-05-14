import React, { useState, useEffect } from 'react';
import { BookOpen, LogOut, User, BookmarkCheck, ExternalLink, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { user, userProfile, signOut, isAuthenticated } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/notes', label: 'Notes', showAlways: true },
    { path: '/bookmarks', label: 'Bookmarks', requireAuth: true }
  ];

  return (
    <header 
      className={`bg-gradient-to-r from-purple-600 to-indigo-700 text-white sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 shadow-lg' : 'py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo section with image */}
          <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
            <div className="relative h-10 w-10 overflow-hidden">
              <img 
                src="/favicon.png" 
                alt="DecodeCOA Logo" 
                className="h-full w-full object-contain"
              />
              <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight">Decode COA</span>
              <span className="text-xs text-white/80 -mt-1">Notes Platform</span>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            (item.showAlways || (item.requireAuth && isAuthenticated)) && (
              <Link 
                key={item.path}
                to={item.path}
                className={`text-white/90 hover:text-white transition-colors relative group ${
                  location.pathname === item.path ? 'font-medium' : ''
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 
                  ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`}>
                </span>
              </Link>
            )
          ))}
        </nav>
        
        {/* Right side buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Visit DecodeCOA button with animation - Hidden on small screens */}
          <a 
            href="https://www.decodecoa.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hidden sm:flex bg-white/10 hover:bg-white/20 transition-all duration-300 px-3 py-1.5 rounded-full text-sm items-center gap-1 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span className="font-medium">Visit</span>
            <span className="font-bold">DecodeCOA</span>
            <ExternalLink className="h-3 w-3 ml-1 animate-pulse" />
          </a>
          
          {/* User authentication section */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="bg-white/20 hover:bg-white/30 gap-2 text-white shadow-md">
                  <User className="h-4 w-4" />
                  <span className="max-w-28 truncate">
                    {userProfile?.name || user?.email?.split('@')[0]}
                  </span>
                  {userProfile?.role && (
                    <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-in slide-in-from-top-5 duration-200">
                <DropdownMenuItem asChild>
                  <Link to="/notes" className="cursor-pointer hover:bg-purple-50 transition-colors">
                    <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
                    My Notes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/bookmarks" className="cursor-pointer hover:bg-purple-50 transition-colors">
                    <BookmarkCheck className="h-4 w-4 mr-2 text-indigo-600" />
                    Bookmarks
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link 
              to="/auth/login" 
              className="bg-white/20 hover:bg-white/30 transition-all duration-300 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <User className="h-4 w-4" /> 
              Log in
            </Link>
          )}
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden bg-white/10 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-indigo-700 to-purple-800 animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map(item => (
              (item.showAlways || (item.requireAuth && isAuthenticated)) && (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={`text-white py-2 px-4 rounded-lg transition-colors ${
                    location.pathname === item.path ? 'bg-white/20 font-medium' : 'hover:bg-white/10'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
            {/* Additional links only in mobile menu */}
            {isAuthenticated && (
              <Link 
                to="/profile" 
                className="text-white py-2 px-4 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            )}
            {isAuthenticated && (
              <button 
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="text-white py-2 px-4 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;