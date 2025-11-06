// Updated src/components/admin/AdminPanel.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { PanelLeft, FolderGit2, Cog, Briefcase, LogOut, Settings, Home } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import ProjectManagement from './ProjectManagement';
import SkillsManagement from './SkillsManagement';
import ExperienceManagement from './ExperienceManagement';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const { logout } = useAuthStore();
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen } = useUIStore();

  const navigation = [
    { id: 'projects', label: 'Projects', icon: FolderGit2, path: '/admin/projects' },
    { id: 'skills', label: 'Skills', icon: Cog, path: '/admin/skills' },
    { id: 'experience', label: 'Experience', icon: Briefcase, path: '/admin/experience' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          )}
          <Button
            variant="outline"
            size="sm"
            icon={PanelLeft}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            {sidebarOpen && <span>View Portfolio</span>}
          </Link>
          
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-grey-700 dark:text-white"
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {sidebarOpen && (
            <div className="flex items-center justify-between p-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? 'Light' : 'Dark'}
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            className="w-full justify-center"
            icon={LogOut}
            onClick={logout}
          >
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/projects" replace />} />
          <Route path="/projects" element={<ProjectManagement />} />
          <Route path="/skills" element={<SkillsManagement />} />
          <Route path="/experience" element={<ExperienceManagement />} />
          <Route path="/settings" element={
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Appearance</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Switch between dark and light mode</p>
                  </div>
                  <Button variant="outline" onClick={toggleTheme}>
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;