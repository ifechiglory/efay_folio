// src/components/sections/Hero.jsx
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import Button from "@ui/Button";
import { BackgroundLines } from "@/components/ui/background-lines";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";

const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden border-b border-gray-700/50"
    >
      <BackgroundLines className="absolute inset-0" svgOptions="duration: 5"/>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight">
              Hi, I'm Ifechukwu Edet
            </h1>
            <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              <span className="text-white text-lg">
                <LayoutTextFlip className="inline-block" filter={false} />
              </span>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              I code. I teach. I ship.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#projects">
              <Button size="lg" icon={ArrowDown} className="text-lg">
                View My Work
              </Button>
            </a>
            <a href="#contact">
              <Button variant="outline" size="lg" className="text-lg">
                Get In Touch
              </Button>
            </a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 pt-6">
            <a
              href="https://github.com/ifechiglory"
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Visit GitHub profile"
            >
              <Github className="w-6 h-6" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/ifechukwuedet"
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Visit LinkedIn profile"
            >
              <Linkedin className="w-6 h-6" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Send Email"
            >
              <Mail className="w-6 h-6" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
