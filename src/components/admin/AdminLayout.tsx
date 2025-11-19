import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bell, 
  Award, 
  BookOpen, 
  HelpCircle, 
  Briefcase, 
  GraduationCap, 
  Video, 
  MessageSquare,
  Menu,
  X,
  LogOut,
  User,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';
import { auth } from '../../utils/auth';
import { toast } from 'sonner@2.0.3';
import logo from 'figma:asset/1cd64d29c347abbc26d8fefe3e909a4610fd103b.png';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/notifications', label: 'Notifications', icon: Bell },
  { path: '/admin/results', label: 'Results', icon: Award },
  { path: '/admin/notes', label: 'Notes', icon: BookOpen },
  { path: '/admin/questions', label: 'Important Questions', icon: HelpCircle },
  { path: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { path: '/admin/internships', label: 'Internships', icon: GraduationCap },
  { path: '/admin/youtube', label: 'YouTube Links', icon: Video },
  { path: '/admin/messages', label: 'Contact Messages', icon: MessageSquare },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const checkAuth = async () => {
    try {
      const currentUser = await auth.getSession();
      if (!currentUser) {
        navigate('/admin/login');
        return;
      }
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#004AAD] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#0A0A0A]/60 text-sm text-center">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Mobile Header - Fixed at top */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Examupdt" className="h-8 w-8 flex-shrink-0" />
          <span className="text-[#0A0A0A] text-sm sm:text-base truncate">Admin Panel</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex-shrink-0"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Add padding to account for fixed header on mobile */}
      <div className="lg:hidden h-[57px]"></div>

      <div className="flex min-h-screen">
        {/* Sidebar - Drawer on mobile, fixed on desktop */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 z-40 h-screen w-[280px] max-w-[85vw] bg-white border-r border-gray-200 
            transform transition-transform duration-300 ease-in-out overflow-hidden
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:top-0 flex flex-col
          `}
        >
          {/* Logo - Desktop only */}
          <div className="hidden lg:flex items-center gap-2 px-6 py-5 border-b border-gray-200 flex-shrink-0">
            <img src={logo} alt="Examupdt" className="h-10 w-10 flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-[#0A0A0A] text-lg leading-tight truncate">Examupdt</h2>
              <p className="text-[#0A0A0A]/60 text-xs leading-tight truncate">Admin Panel</p>
            </div>
          </div>

          {/* Mobile header inside drawer */}
          <div className="lg:hidden px-4 py-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <img src={logo} alt="Examupdt" className="h-10 w-10 flex-shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-[#0A0A0A] text-lg leading-tight truncate">Examupdt</h2>
                  <p className="text-[#0A0A0A]/60 text-xs leading-tight truncate">Admin Panel</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="px-4 py-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3 p-3 bg-[#F5F5F5] rounded-lg min-w-0">
              <div className="w-10 h-10 bg-[#004AAD] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#0A0A0A] text-sm truncate">{user?.name || 'Admin'}</p>
                <p className="text-[#0A0A0A]/60 text-xs truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3.5 rounded-lg transition-colors text-sm
                      ${
                        isActive
                          ? 'bg-[#004AAD] text-white'
                          : 'text-[#0A0A0A] hover:bg-[#F5F5F5]'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Actions - Fixed at bottom */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start text-sm"
              onClick={() => navigate('/')}
            >
              <ExternalLink className="w-4 h-4 mr-3 flex-shrink-0" />
              <span className="truncate">View User Panel</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
              <span className="truncate">Logout</span>
            </Button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen w-full lg:w-auto overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}