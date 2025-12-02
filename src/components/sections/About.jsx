import { motion } from "framer-motion";
import { useState } from "react";
import profile from "@assets/images/ife.webp";
import {
  Cog,
  Calendar,
  Download,
  Code,
  Palette,
  GitBranch,
  Zap,
  Layout,
  Cpu,
  Settings,
  Database,
  Server,
  Users,
  Atom,
} from "lucide-react";
import { useSkills } from "@/hooks/useSkills";
import { useExperience } from "@hooks/useExperience";
import { useDownload } from "@hooks/useDownload";
import Button from "@ui/Button";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const About = () => {
  const { downloadFile } = useDownload();
  const { data: skills = [] } = useSkills();
  const { data: experiences = [] } = useExperience();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownloadResume = () => {
    downloadFile("/efay_folio/resume.pdf", "Ifechukwu.pdf");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const getSkillSections = () => {
    const categoryConfigs = {
      "Frontend Core": {
        title: "Frontend Fundamentals",
        subtitle: "Core web technologies & browser APIs",
        icon: <Code className="w-5 h-5 text-gray-300" />,
        color: "blue",
      },
      "Backend & APIs": {
        title: "Backend & API Development",
        subtitle: "Server-side logic & API integration",
        icon: <Cpu className="w-5 h-5 text-gray-300" />,
        color: "green",
      },
      "React Ecosystem": {
        title: "React Ecosystem",
        subtitle: "React-specific tools & libraries",
        icon: <Atom className="w-5 h-5 text-gray-300" />,
        color: "cyan",
      },
      "Frameworks & Libraries": {
        title: "Frameworks & Libraries",
        subtitle: "Modern development frameworks & tools",
        icon: <Layout className="w-5 h-5 text-gray-300" />,
        color: "purple",
      },
      "Styling & Design": {
        title: "UI/UX & Styling",
        subtitle: "Design systems & visual implementation",
        icon: <Palette className="w-5 h-5 text-gray-300" />,
        color: "pink",
      },
      "Dev & Build Tools": {
        title: "Development Tools",
        subtitle: "Version control & development workflow",
        icon: <Settings className="w-5 h-5 text-gray-300" />,
        color: "gray",
      },
      "Database & Storage": {
        title: "Database & Storage",
        subtitle: "Data management & persistence solutions",
        icon: <Database className="w-5 h-5 text-gray-300" />,
        color: "orange",
      },
      Deployment: {
        title: "Deployment & DevOps",
        subtitle: "CI/CD & production deployment",
        icon: <Server className="w-5 h-5 text-gray-300" />,
        color: "red",
      },
      "Performance Optimization": {
        title: "Performance & Optimization",
        subtitle: "Speed, efficiency & user experience",
        icon: <Zap className="w-5 h-5 text-gray-300" />,
        color: "amber",
      },
      "Soft Skills": {
        title: "Professional Skills",
        subtitle: "Collaboration & project management",
        icon: <Users className="w-5 h-5 text-gray-300" />,
        color: "indigo",
      },
    };

    return Object.entries(categoryConfigs)
      .map(([supabaseCategory, config]) => {
        const skillsInCategory = skills.filter(
          (skill) => skill.category === supabaseCategory
        );

        return {
          ...config,
          skills: skillsInCategory.map((skill) => skill.name),
        };
      })
      .filter((section) => section.skills.length > 0);
  };

  const skillSections = getSkillSections();

  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    green:
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
    purple:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    orange:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800",
    indigo:
      "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    gray: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
    red: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800",
    amber:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    cyan: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  };

  // In your About component, update the categoryCards:
  const categoryCards = skillSections.map((section) => (
    <div
      key={section.title}
      className="w-full h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center mb-4">
        <div
          className={`p-3 rounded-lg ${
            colorClasses[section.color].split(" ")[0]
          } ${colorClasses[section.color].split(" ")[1]}`}
        >
          {section.icon}
        </div>
        <div className="ml-4">
          <h4 className="font-bold text-gray-900 dark:text-white text-lg">
            {section.title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {section.subtitle}
          </p>
        </div>
      </div>

      {/* Skills Badges */}
      <div className="flex flex-wrap gap-2">
        {section.skills.map((skill, skillIndex) => (
          <span
            key={skillIndex}
            className={`px-3 py-2 rounded-full text-sm font-medium border ${
              colorClasses[section.color]
            }`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  ));

  return (
    <section
      id="about"
      className="py-20 bg-white dark:bg-gray-900 border-b border-gray-700/50"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-12 mb-20 p-3 space-y-9">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12 mt-16"
          >
            <div className="relative">
              <div className="relative w-full h-80 col-span-1 overflow-hidden rounded-xl">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl blur-sm z-10" />
                )}

                <picture>
                  <source srcSet={profile} type="image/webp" />
                  <img
                    src={profile}
                    alt="Ifechukwu Edet"
                    className={`w-full h-full object-cover rounded-xl shadow-lg transition-all duration-500 ${
                      imageLoaded
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105"
                    }`}
                    loading="eager"
                    width={400}
                    height={500}
                    onLoad={() => setImageLoaded(true)}
                  />
                </picture>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-900/60 rounded-full"></div>
            </div>

            <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed text-lg text-justify">
              <p>
                I'm a Frontend Developer specializing in building responsive,
                production-ready applications with{" "}
                <strong>React, Vite, and Tailwind CSS</strong>. I bridge the gap
                between design and development, transforming detailed Figma
                prototypes into pixel-perfect, accessible web experiences.{" "}
                <br></br> I write clean, maintainable code that scales
                gracefully across devices and use cases.
              </p>
              <p>
                Beyond development, I've led{" "}
                <strong> frontend training programs</strong>, designing
                comprehensive learning paths for HTML, CSS, JavaScript, and
                React. This experience honed my ability to communicate complex
                concepts clearly enhancing collaboration and knowledge sharing
                within development teams.
              </p>
            </div>

            <div className="pt-4">
              <Button
                icon={Download}
                size="lg"
                onClick={handleDownloadResume}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Download Resume
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-2"
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <Calendar className="w-7 h-7 mr-3 text-blue-600" />
              Work Experience
            </h3>

            <div className="space-y-6">
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-8"
                >
                  {index !== experiences.length - 1 && (
                    <div className="absolute left-3 top-8 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
                  )}

                  <div className="absolute left-0 top-1 w-6 h-6 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 z-10" />
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {experience.position}
                      </h4>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-0">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(experience.start_date)} -{" "}
                        {experience.current
                          ? "Present"
                          : formatDate(experience.end_date)}
                      </div>
                    </div>

                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                      {experience.company}
                    </p>

                    <ul className="space-y-2">
                      {experience.description?.map((point, idx) => (
                        <li
                          key={idx}
                          className="text-gray-600 dark:text-gray-300 text-sm flex items-start text-justify"
                        >
                          <span className="text-blue-600 mr-2">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>

                    {experience.skills && experience.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {experience.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {experiences.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Work experience will appear here once added in the admin
                    dashboard.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Skills Section with Infinite Moving Category Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center flex items-center justify-center">
            <Cog className="w-7 h-7 mr-3 text-blue-600" />
            Skills & Technologies
          </h3>

          {skillSections.length > 0 ? (
            <div className="h-[300px] rounded-md flex flex-col antialiased bg-white dark:bg-gray-800 dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
              <InfiniteMovingCards
                items={categoryCards}
                direction="right"
                speed="slow"
                pauseOnHover={true}
                renderItem={(item, index) => item}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <Cog className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Skills coming soon
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Skills will appear here once added through the admin dashboard
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default About;