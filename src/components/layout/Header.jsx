// src/components/layout/Header.jsx
import { Link, useLocation } from "react-router-dom";
import { Code2, LogIn } from "lucide-react";
import Button from "../ui/Button";

const Header = () => {
  const location = useLocation();
  const showAdminButton = import.meta.env.VITE_SHOW_ADMIN_BUTTON === "true";

  const isActive = (path) => location.hash === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png"></img>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Efay
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#home"
              className={`transition-colors ${
                isActive("#home")
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Home
            </a>
            <a
              href="#about"
              className={`transition-colors ${
                isActive("#about")
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              About
            </a>

            <a
              href="#projects"
              className={`transition-colors ${
                isActive("#projects")
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Projects
            </a>
            <a
              href="#contact"
              className={`transition-colors ${
                isActive("#contact")
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              Contact
            </a>
          </nav>

          {/* Theme Toggle & Admin */}
          <div className="flex items-center space-x-4">
            {showAdminButton && (
              <Link to="/admin/login">
                <Button variant="primary" size="sm" icon={LogIn}>
                  Admin
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
