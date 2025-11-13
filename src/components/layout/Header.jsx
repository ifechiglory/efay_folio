import { Link, useLocation } from "react-router-dom";
import {LogIn, Menu, X } from "lucide-react";
import Button from "../ui/Button";
import { useState } from "react";
import { motion } from "framer-motion";

const Header = () => {
  const location = useLocation();
  const showAdminButton = import.meta.env.VITE_SHOW_ADMIN_BUTTON === "true";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.hash === path;

  const navigationItems = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 w-screen rounded-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/#home" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Efay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  isActive(item.href)
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Theme Toggle & Admin */}
          <div className="hidden md:flex items-center space-x-4">
         {showAdminButton && (
              <Link to="/admin/login">
                <Button variant="primary" size="sm" icon={LogIn}>
                  Admin
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-400 hover:bg-gray-500 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed right-0 top-16 w-screen dark:bg-gray-900/90 bg-gray-50/90"
          >
            <div className="w-2/4 bg-white px-2 h-screen fixed dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 right-0">
              <nav className="flex flex-col space-y-4 pt-4">
                {navigationItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`py-2 px-4 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}

                {/* Mobile Admin Button */}
                {showAdminButton && (
                  <Link
                    to="/admin/login"
                    onClick={closeMobileMenu}
                    className="py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-center"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <LogIn className="w-4 h-4" />
                      <span>Admin</span>
                    </div>
                  </Link>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
