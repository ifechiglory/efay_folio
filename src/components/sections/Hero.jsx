// src/components/sections/Hero.jsx
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import Button from "../ui/Button";
import { useState, useEffect, useMemo } from "react";

const Hero = () => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const roles = useMemo(
    () => [
      "Developer",
      "Architect",
      "Designer",
      "Innovator",
      "Specialist",
      "Visionary",
    ],
    []
  );

  useEffect(() => {
    const handleTyping = () => {
      const current = loopNum % roles.length;
      const fullText = roles[current];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 75 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, roles, typingSpeed]);

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
                Frontend{" "}
                <span className="text-blue-600 relative">
                  {text}
                  <span className="absolute -right-2 top-0 bottom-0 w-0.5 bg-blue-600 animate-pulse"></span>
                </span>{" "}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg text-justify">
                I tell stories through clean, clear designs, crafting digital experiences with modern technologies. I build
                fast, accessible, and visually appealing web applications.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex md:flex-wrap gap-4">
              <a href="#projects">
                <Button size="responsive" icon={ArrowDown}>
                  View My Work
                </Button>
              </a>
              <a href="#contact">
                <Button variant="outline" size="responsive">
                  Get In Touch
                </Button>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              <a
                href="https://github.com/ifechiglory"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/ifechukwuedet"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="#contact"
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
            <div className="relative w-full h-96 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-end justify-center overflow-hidden shadow-2xl">
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
