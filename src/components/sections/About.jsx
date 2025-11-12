// src/components/sections/About.jsx
import { motion } from 'framer-motion';
import { Cog, Calendar, MapPin, Download } from 'lucide-react';
import { useSkills } from '../../hooks/useSkills';
import { useExperience } from '../../hooks/useExperience';
import { useDownload } from '../../hooks/useDownload';
import Button from '../ui/Button';

const About = () => {
  const { downloadFile } = useDownload();
  const { data: skills = [] } = useSkills();
  const { data: experiences = [] } = useExperience();

  const skillCategories = {
    'Frontend': skills.filter(skill => skill.category === 'Frontend'),
    'Backend': skills.filter(skill => skill.category === 'Backend'),
    'Tools': skills.filter(skill => skill.category === 'Tools'),
    'Soft Skills': skills.filter(skill => skill.category === 'Soft Skills'),
  };

  const handleDownloadResume = () => {
    downloadFile("/resume.pdf", "Ifechukwu.pdf");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <section
      id="about"
      className="py-20 bg-white dark:bg-gray-900 border-b border-gray-700/50"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
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

        {/* About & Experience - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left Column - Personal Introduction */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed text-lg text-justify">
              <p>
                I'm a Frontend Developer specializing in building responsive,
                production-ready applications with{" "}
                <strong>React, Vite, and Tailwind CSS</strong>. I bridge the gap
                between design and development, transforming detailed Figma
                prototypes into pixel-perfect, accessible web experiences.
              </p>
              <p>
                Beyond development, I've led
                <strong> frontend training programs</strong>, designing
                comprehensive learning paths for HTML, CSS, JavaScript, and
                React. This experience honed my ability to communicate complex
                concepts clearly enhancing collaboration and knowledge sharing
                within development teams.
              </p>

              <p>
                I'm passionate about creating web experiences that{" "}
                <strong>
                  balance aesthetic precision with practical functionality
                </strong>
                , ensuring they not only look exceptional but perform flawlessly
                for users.
              </p>
            </div>

            {/* Download Resume Button */}
            <div className="pt-4">
              <Button
                icon={Download}
                size="responsive"
                onClick={handleDownloadResume}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Download Resume
              </Button>
            </div>
          </motion.div>

          {/* Right Column - Experience */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
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
                  {/* Timeline line */}
                  {index !== experiences.length - 1 && (
                    <div className="absolute left-3 top-8 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
                  )}

                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1 w-6 h-6 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 z-10" />

                  {/* Content */}
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
                      <div className="flex flex-wrap gap-2 mt-4" id="skills">
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

              {/* Empty State */}
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

        {/* Skills Section - Full Width Row */}
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

          <div className="space-y-12">
            {Object.entries(skillCategories).map(
              ([category, categorySkills]) => {
                if (categorySkills.length === 0) return null;

                return (
                  <div key={category} className="space-y-6">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white text-justify mb-2">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {categorySkills.map((skill) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.2 },
                          }}
                          className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="text-center space-y-4">
                            {/* Skill Name */}
                            <h5 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                              {skill.name}
                            </h5>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{
                                    width: `${skill.proficiency * 10}%`,
                                  }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                  className="bg-linear-to-r from-blue-500 to-blue-600 h-2.5 rounded-full shadow-inner"
                                />
                              </div>

                              {/* Proficiency Level */}
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Proficiency
                                </span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                  {skill.proficiency}/10
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;