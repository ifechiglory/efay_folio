// src/components/sections/Hero.jsx
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import Button from '../ui/Button';

const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-20 border-b border-gray-700/50"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
                Frontend <span className="text-blue-600">Developer</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg">
                Crafting digital experiences with modern technologies. I build
                fast, accessible, and visually appealing web applications.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a href="#projects">
                <Button size="lg" icon={ArrowDown}>
                  View My Work
                </Button>
              </a>
              <a href="#contact">
                <Button variant="outline" size="lg">
                  Get In Touch
                </Button>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              <a
                href="#"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
          {/* Image/Visual Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full h-96 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-end justify-center overflow-hidden shadow-2xl">
              {/* Profile Image - Very large and popping out dramatically */}
              <div className="absolute -top-12 w-80 h-96 flex items-center justify-center">
                <img
                  src="/profile.png"
                  alt="Profile"
                  className="w-full h-full object-cover object-top rounded-t-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Strong linear overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-blue-600/40 via-transparent to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;