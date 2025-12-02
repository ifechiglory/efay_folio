import { Link, useLocation } from "react-router-dom";
import logo from "@assets/images/logo.svg";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Home, User, Folder, Mail } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      link: "#home",
      icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "#about",
      icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Projects",
      link: "#projects",
      icon: <Folder className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "#contact",
      icon: <Mail className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  return (
    <FloatingNav
      navItems={navItems}
      sticky={true}
      stickyTop="top-1"
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700"
    />
  );
};

export default Header;
