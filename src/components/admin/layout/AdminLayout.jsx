import React from 'react';
import Header from "../../layout/Header";
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  BookOpen,
  Clock,
  Settings,
  Calendar,
  Activity
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  console.log('Current location:', location);
  console.log('AdminLayout rendered');

  const navigation = [
    { 
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard
    },
    { 
      name: 'Team Management',
      href: '/admin/team',
      icon: Users
    },
    { 
      name: 'Job Positions',
      href: '/admin/positions',
      icon: Briefcase
    },
    { 
      name: 'Applications',
      href: '/admin/applications',
      icon: FileText
    },
    { 
      name: 'Blog Management',
      href: '/admin/blog',
      icon: BookOpen
    },
    { 
      name: 'Time Logs',
      href: '/admin/time-logs',
      icon: Clock
    },
    { 
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings
    },
    { 
      name: 'Schedule Overview',
      href: '/admin/schedule',
      icon: Calendar
    },
    { 
      name: 'Staff Performance',
      href: '/admin/performance',
      icon: Activity
    }
  ];

  const isActiveRoute = (href) => {
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 pt-16"> {/* Added pt-16 for header space */}
    
      {/* Header */}
      <Header />
      {/* Sidebar */}
      <aside className="fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-gray-200 z-40"> {/* Changed to top-16 */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
        </div>
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center py-2 px-3 rounded-lg text-sm ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="min-h-[calc(100vh-4rem)] p-6"> {/* Adjusted height calculation */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;