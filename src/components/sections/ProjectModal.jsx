// src/components/ProjectModal.jsx
import { motion } from 'framer-motion';
import { X, ExternalLink, Github, Calendar } from 'lucide-react';

const ProjectModal = ({ project, isOpen, onClose }) => {
  if (!isOpen || !project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white pr-12">
            {project.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {project.description}
          </p>
        </div>

        {/* Image */}
        {project.image_url && (
          <div className="p-6">
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Project Info */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.tech_stack && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Tech Stack
                </h4>
                <span className="text-gray-600 dark:text-gray-400">
                  {Array.isArray(project.tech_stack) 
                    ? project.tech_stack.join(', ')
                    : project.tech_stack
                  }
                </span>
              </div>
            )}
            
            {project.created_at && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Created
                </h4>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(project.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            )}
          </div> */}

          {/* Tech Stack as Tags */}
          {project.tech_stack && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(project.tech_stack) 
                  ? project.tech_stack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))
                  : project.tech_stack.split(',').map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {tech.trim()}
                      </span>
                    ))
                }
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-4 pt-4">
            {project.live_demo && (
              <a
                href={project.live_demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}
            
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View Code</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;