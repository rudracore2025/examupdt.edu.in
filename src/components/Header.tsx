import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Home, FileText, Award, Briefcase, Video, BookOpen, HelpCircle, Shield } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import logo from 'figma:asset/1cd64d29c347abbc26d8fefe3e909a4610fd103b.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/notifications', label: 'Updates', icon: Bell },
    { path: '/results', label: 'Results', icon: Award },
    { path: '/notes', label: 'Notes', icon: BookOpen },
    { path: '/important-questions', label: 'Questions', icon: HelpCircle },
    { path: '/jobs-internships', label: 'Jobs', icon: Briefcase },
    { path: '/youtube', label: 'Videos', icon: Video },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Examupdt Logo" className="h-12 w-12 object-contain" />
            <span className="text-[#0A0A0A] tracking-tight">Examupdt</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#004AAD] text-white'
                      : 'text-[#0A0A0A] hover:bg-[#F5F5F5]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Admin Button */}
            <Link
              to="/admin/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-[#0A0A0A] hover:bg-gray-200 transition-colors ml-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#004AAD] text-white'
                      : 'text-[#0A0A0A] hover:bg-[#F5F5F5]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Admin Button Mobile */}
            <Link
              to="/admin/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 text-[#0A0A0A] hover:bg-gray-200 transition-colors"
            >
              <Shield className="w-5 h-5" />
              <span>Admin</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}