// src/components/sections/Projects.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import { ExternalLink, Github, Eye } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import {
  getOptimizedImageWithProfile,
  getProjectPreviewImage,
} from "@/lib/cloudinary";
import ProjectModal from "./ProjectModal";


const useOptimizedProjects = () => {
  const { data: projects = [], isLoading, ...rest } = useProjects();

  const optimizedProjects = projects.map((project) => ({
    ...project,
    image_url: getProjectPreviewImage(project),
  }));

  return { data: optimizedProjects, isLoading, ...rest };
};

const Projects = () => {
  const { data: projects = [], isLoading } = useOptimizedProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const otherProjects = projects.filter((project) => !project.featured);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleImageError = (e) => {
    // Fallback if optimized image fails to load
    e.target.style.display = "none";
    const parent = e.target.parentElement;
    const fallbackDiv = parent.querySelector(".image-fallback");
    if (fallbackDiv) {
      fallbackDiv.style.display = "flex";
    }
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-200 dark:bg-gray-700 rounded-lg h-80"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and
            experience
          </p>
        </motion.div>

        {otherProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  {/* Project Image - OPTIMIZED */}
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                    {project.image_url ? (
                      <img
                        src={getOptimizedImageWithProfile(
                          project.image_url,
                          "thumbnail"
                        )}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        width="400"
                        height="192"
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    ) : null}
                    {/* Fallback when no image or image fails to load */}
                    <div
                      className={`image-fallback w-full h-full flex items-center justify-center text-gray-400 ${
                        project.image_url ? "hidden" : "flex"
                      }`}
                    >
                      <Eye className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {Array.isArray(project.tech_stack)
                        ? project.tech_stack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                            >
                              {tech}
                            </span>
                          ))
                        : project.tech_stack
                            ?.split(",")
                            .slice(0, 3)
                            .map((tech) => (
                              <span
                                key={tech.trim()}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                      {(Array.isArray(project.tech_stack)
                        ? project.tech_stack.length > 3
                        : project.tech_stack?.split(",").length > 3) && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                          +
                          {Array.isArray(project.tech_stack)
                            ? project.tech_stack.length - 3
                            : project.tech_stack.split(",").length - 3}
                        </span>
                      )}
                    </div>

                    {/* Project Links */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {project.live_demo && (
                          <a
                            href={project.live_demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {project.github_link && (
                          <a
                            href={project.github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => handleProjectClick(project)}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Projects Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              I'm currently working on some exciting projects. Check back soon
              to see what I've been building!
            </p>
          </motion.div>
        )}

        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </section>
  );
};

export default Projects;
