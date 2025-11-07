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
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Passionate developer with a focus on creating exceptional digital
            experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Personal Info & Skills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Personal Introduction */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Hello! I'm Ifechukwu Edet
              </h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  I'm a passionate frontend developer with a keen eye for design
                  and user experience. I love building modern, responsive web
                  applications that not only look great but also provide
                  seamless user interactions.
                </p>
                <p>
                  With expertise in modern JavaScript frameworks and a strong
                  foundation in web fundamentals, I strive to write clean,
                  maintainable code while staying up-to-date with the latest
                  industry trends and best practices.
                </p>
              </div>
            </div>
            {/* Skills Section - Updated to Horizontal Layout */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Cog className="w-6 h-6 mr-2 text-blue-600" />
                Skills & Technologies
              </h3>

              <div className="space-y-8">
                {Object.entries(skillCategories).map(
                  ([category, categorySkills]) => {
                    if (categorySkills.length === 0) return null;

                    return (
                      <div key={category}>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                          {category}
                        </h4>
                        <div className="flex flex-wrap gap-4">
                          {categorySkills.map((skill) => (
                            <div
                              key={skill.id}
                              className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-w-[120px]"
                            >
                              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-3">
                                {skill.name}
                              </span>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${skill.proficiency * 10}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">
                                {skill.proficiency}/10
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            {/* Download Resume */}
            <div className="pt-6">
              <Button icon={Download} size="lg" onClick={handleDownloadResume}>
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
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-blue-600" />
              Work Experience
            </h3>

            <div className="space-y-8">
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-8 pb-8 last:pb-0"
                >
                  {/* Timeline line */}
                  {index !== experiences.length - 1 && (
                    <div className="absolute left-3 top-8 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
                  )}

                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1 w-6 h-6 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900" />

                  {/* Content */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
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
                          className="text-gray-600 dark:text-gray-300 text-sm flex items-start"
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

              {/* Empty State */}
              {experiences.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
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
      </div>
    </section>
  );
};

export default About;