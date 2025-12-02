// src/components/ProjectModal.jsx
import {
  ExternalLink,
  Github,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getOptimizedImageWithProfile,
  getOriginalImage,
  getProjectImagesWithProfiles,
} from "@/lib/cloudinary";
import { Modal, ModalBody, ModalContent } from "@/components/ui/animated-modal";

const ProjectModal = ({ project, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllTech, setShowAllTech] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [processedImages, setProcessedImages] = useState([]); 

  useEffect(() => {
    if (project) {
      const imageUrls =
        project.images && project.images.length > 0
          ? project.images
          : project.image_url
          ? [project.image_url]
          : [];

      const images = getProjectImagesWithProfiles(imageUrls);
      setProcessedImages(images);
      setCurrentImageIndex(0);
      setImageLoading(images.length > 0);
    }
  }, [project]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === processedImages.length - 1 ? 0 : prev + 1
    );
    setImageLoading(true);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? processedImages.length - 1 : prev - 1
    );
    setImageLoading(true);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = (e) => {
    setImageLoading(false);
    console.error("Failed to load modal image:", e.target.src);
  };

  const techStackArray = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : project.tech_stack?.split(",").map((tech) => tech.trim()) || [];

  const displayedTech = showAllTech
    ? techStackArray
    : techStackArray.slice(0, 5);
  const hasMoreTech = techStackArray.length > 5;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBody className="max-w-4xl w-full min-h-[80%] max-h-[90vh]">
        <ModalContent className="p-0 overflow-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl">
          {/* Image Gallery - Full Width - Updated to use processedImages */}
          {processedImages.length > 0 && (
            <div className="relative bg-gray-100 dark:bg-gray-800 w-full">
              <div className="relative w-full overflow-hidden">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                )}
                <img
                  src={processedImages[currentImageIndex]?.original}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  className={`w-full h-auto max-h-[60vh] object-cover transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                {processedImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 backdrop-blur-sm z-20"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 backdrop-blur-sm z-20"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-black/50 text-white text-sm rounded-full backdrop-blur-sm z-20">
                      {currentImageIndex + 1} / {processedImages.length}
                    </div>
                  </>
                )}
              </div>
              {processedImages.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto border-t border-gray-200 dark:border-gray-700">
                  {processedImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setImageLoading(true);
                      }}
                      className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === currentImageIndex
                          ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      <img
                        src={image.thumbnail}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rest of your content remains exactly the same */}
          {/* Title and Metadata */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {project.title}
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                {project.created_at && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(project.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                )}

                {project.category && (
                  <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                    {project.category}
                  </div>
                )}

                {project.status && (
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === "Completed"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                    }`}
                  >
                    {project.status}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Grid - Description on left, Tech on right */}
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Project Description */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Project Description
                </h4>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {project.description}
                  </p>

                  {/* Detailed Description */}
                  {project.detailed_description && (
                    <div className="mt-6">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {project.detailed_description}
                      </p>
                    </div>
                  )}

                  {/* Features List */}
                  {project.features && project.features.length > 0 && (
                    <div className="mt-6">
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                        Key Features:
                      </h5>
                      <ul className="space-y-2">
                        {project.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start text-gray-700 dark:text-gray-300"
                          >
                            <span className="text-blue-500 mr-3 mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Challenges & Solutions */}
              {(project.challenges || project.solutions) && (
                <div className="space-y-4">
                  {project.challenges && (
                    <div>
                      <h5 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                        Challenges
                      </h5>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {project.challenges}
                      </p>
                    </div>
                  )}

                  {project.solutions && (
                    <div>
                      <h5 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                        Solutions
                      </h5>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {project.solutions}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Technologies */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-3">
                  {displayedTech.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      {tech}
                    </span>
                  ))}
                  {hasMoreTech && !showAllTech && (
                    <button
                      onClick={() => setShowAllTech(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      +{techStackArray.length - 5} more
                    </button>
                  )}
                  {hasMoreTech && showAllTech && (
                    <button
                      onClick={() => setShowAllTech(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-semibold shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      Show less
                    </button>
                  )}
                </div>
              </div>

              {/* Action Links as Icons */}
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Project Links
                </h4>
                <div className="flex gap-4">
                  {project.live_demo && (
                    <a
                      href={project.live_demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}

                  {project.github_link && (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center w-12 h-12 bg-gray-800 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-900 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                      title="View Code"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}

                  {project.documentation && (
                    <a
                      href={project.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                      title="Documentation"
                    >
                      <span className="text-sm font-bold">Docs</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
};

export default ProjectModal;
