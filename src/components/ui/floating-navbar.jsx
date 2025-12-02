"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  className,
  sticky = true,
  stickyTop = "top-10",
}) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex max-w-1/2 h-16 mx-auto border border-gray-200 dark:border-white/20 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg z-5000 px-8 py-3 items-center justify-center space-x-5",
        sticky && stickyTop,  
        sticky ? "fixed inset-x-0" : "relative",
        className
      )}
    >
      {navItems.map((navItem, idx) => (
        <a
          key={`link=${idx}`}
          href={navItem.link}
          className={cn(
            "relative text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center space-x-1"
          )}
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="hidden sm:block text-md font-medium">
            {navItem.name}
          </span>
        </a>
      ))}
    </motion.div>
  );
};
