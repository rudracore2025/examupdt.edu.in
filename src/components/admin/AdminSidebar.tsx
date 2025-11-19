import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Award,
  BookOpen,
  Briefcase,
  Video,
  Mail,
  LogOut,
} from 'lucide-react';
import logo from 'figma:asset/1cd64d29c347abbc26d8fefe3e909a4610fd103b.png';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/posts', label: 'Posts', icon: FileText },
  { path: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { path: '/admin/results', label: 'Results', icon: Award },
  { path: '/admin/notes', label: 'Notes', icon: BookOpen },
  { path: '/admin/jobs', label: 'Jobs & Internships', icon: Briefcase },
  { path: '/admin/videos', label: 'YouTube Links', icon: Video },
  { path: '/admin/messages', label: 'Contact Messages', icon: Mail },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/admin" className="flex items-center gap-2">
          <img src={logo} alt="Examupdt Logo" className="h-12 w-12 object-contain" />
          <div>
            <div className="text-[#0A0A0A]">Examupdt</div>
            <div className="text-[#0A0A0A]/40 text-xs">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#004AAD] text-white'
                  : 'text-[#0A0A0A] hover:bg-[#F5F5F5]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-[#0A0A0A] hover:bg-[#F5F5F5] rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Back to Site</span>
        </Link>
      </div>
    </aside>
  );
}