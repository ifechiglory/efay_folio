import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@types/schemas";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useAddProjectImages,
  useRemoveProjectImage,
  useSetMainProjectImage,
} from "@hooks/useProjects";
import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  getOptimizedImageUrl,
  getOptimizedImageWithProfile,
} from "@lib/cloudinary";
import Button from "@ui/Button";
import Input from "@ui/Input";
import Modal from "@ui/Modal";
import { useUIStore } from "@stores/uiStore";

const useOptimizedProjects = () => {
  const { data: projects = [], isLoading, ...rest } = useProjects();
  const optimizedProjects = projects.map((project) => ({
    ...project,
    image_url: project.image_url
      ? getOptimizedImageUrl(project.image_url, {
          width: 400,
          height: 192,
          quality: "80",
          format: "auto",
        })
      : null,
  }));

  return { data: optimizedProjects, isLoading, ...rest };
};

const ProjectManagement = () => {
  const [editingProject, setEditingProject] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const { openModal, closeModal, addToast } = useUIStore();

  const { data: projects = [], isLoading } = useOptimizedProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const addProjectImages = useAddProjectImages();
  const removeProjectImage = useRemoveProjectImage();
  const setMainProjectImage = useSetMainProjectImage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  const handleCreateProject = () => {
    setEditingProject(null);
    reset();
    setImageFile(null);
    setImagePreview(null);
    setGalleryFiles([]);
    openModal("project-form");
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    reset(project);
    setImagePreview(
      project.image_url
        ? getOptimizedImageUrl(project.image_url, {
            width: 600,
            height: 240,
            quality: "90",
          })
        : null
    );
    setGalleryFiles([]);
    openModal("project-form");
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      addToast({
        type: "error",
        message: "Please select a PNG, JPG, or WEBP image file",
        autoHide: true,
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        type: "error",
        message: "Image size must be less than 5MB",
        autoHide: true,
      });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleGallerySelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      addToast({
        type: "error",
        message: "Please select only PNG, JPG, or WEBP image files",
        autoHide: true,
      });
      return;
    }

    // Validate file sizes (5MB max each)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      addToast({
        type: "error",
        message: "Image sizes must be less than 5MB each",
        autoHide: true,
      });
      return;
    }

    setGalleryFiles((prev) => [...prev, ...files]);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const removeGalleryFile = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetMainImage = async (projectId, imageUrl) => {
    try {
      await setMainProjectImage.mutateAsync({
        projectId,
        imageUrl,
      });
      addToast({
        type: "success",
        message: "Main image updated successfully!",
        autoHide: true,
      });
    } catch (error) {
      addToast({
        type: "error",
        message: "Failed to update main image",
        autoHide: true,
      });
    }
  };

  const handleRemoveGalleryImage = async (projectId, imageIndex) => {
    try {
      await removeProjectImage.mutateAsync({
        projectId,
        imageIndex,
      });
      addToast({
        type: "success",
        message: "Image removed from gallery!",
        autoHide: true,
      });
    } catch (error) {
      addToast({
        type: "error",
        message: "Failed to remove image",
        autoHide: true,
      });
    }
  };

  const handleAddGalleryImages = async (projectId) => {
    if (galleryFiles.length === 0) return;

    try {
      addToast({
        type: "info",
        message: "Uploading gallery images...",
        autoHide: false,
      });

      const newImageUrls = await uploadMultipleToCloudinary(galleryFiles);
      await addProjectImages.mutateAsync({
        projectId,
        newImages: newImageUrls,
      });

      addToast({
        type: "success",
        message: `${newImageUrls.length} images added to gallery!`,
        autoHide: true,
      });

      setGalleryFiles([]);
    } catch (error) {
      addToast({
        type: "error",
        message: "Failed to upload gallery images",
        autoHide: true,
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = editingProject?.image_url || "";

      // Upload main image to Cloudinary if a new file is selected
      if (imageFile) {
        addToast({
          type: "info",
          message: "Uploading main image...",
          autoHide: false,
        });

        try {
          imageUrl = await uploadToCloudinary(imageFile);
          addToast({
            type: "success",
            message: "Main image uploaded successfully!",
            autoHide: true,
          });
        } catch (error) {
          console.error("Image upload failed:", error);
          addToast({
            type: "error",
            message: "Failed to upload main image. Please try again.",
            autoHide: true,
          });
          return;
        }
      }

      const techStackArray = data.techStack
        ? data.techStack
            .split(",")
            .map((tech) => tech.trim())
            .filter((tech) => tech !== "")
        : [];

      const projectData = {
        title: data.title,
        description: data.description,
        tech_stack: techStackArray,
        github_link: data.githubUrl || null,
        live_demo: data.liveUrl || null,
        image_url: imageUrl || null,
        // Initialize empty images array if creating new project
        ...(editingProject ? {} : { images: [] }),
      };

      console.log("Saving project data:", projectData);

      if (editingProject) {
        const updatedProject = await updateProject.mutateAsync({
          id: editingProject.id,
          updates: projectData,
        });

        if (galleryFiles.length > 0) {
          await handleAddGalleryImages(editingProject.id);
        }

        addToast({
          type: "success",
          message: "Project updated successfully!",
          autoHide: true,
        });
      } else {
        const newProject = await createProject.mutateAsync(projectData);

        // Upload gallery images after project is created
        if (galleryFiles.length > 0) {
          await handleAddGalleryImages(newProject.id);
        }

        addToast({
          type: "success",
          message: "Project created successfully!",
          autoHide: true,
        });
      }

      closeModal();
      reset();
      setImageFile(null);
      setImagePreview(null);
      setGalleryFiles([]);
    } catch (error) {
      console.error("Error saving project:", error);
      addToast({
        type: "error",
        message: `Failed to save project: ${error.message}`,
        autoHide: true,
      });
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject.mutateAsync(projectId);
        addToast({
          type: "success",
          message: "Project deleted successfully!",
          autoHide: true,
        });
      } catch (error) {
        addToast({
          type: "error",
          message: "Failed to delete project. Please try again.",
          autoHide: true,
        });
      }
    }
  };

  const handleImageError = (e) => {
    // Fallback if optimized image fails to load
    e.target.style.display = "none";
    const fallbackDiv = e.target.nextSibling;
    if (fallbackDiv) {
      fallbackDiv.style.display = "flex";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your portfolio projects
          </p>
        </div>
        <Button icon={Plus} onClick={handleCreateProject}>
          Add Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Optimized Project Image */}
            <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
              {project.image_url ? (
                <img
                  src={project.image_url}
                  alt={`Screenshot of ${project.title} project`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="192"
                  onError={handleImageError}
                />
              ) : null}
              {/* Fallback when no image or image fails to load */}
              <div
                className={`w-full h-full flex items-center justify-center text-gray-400 ${
                  project.image_url ? "hidden" : "flex"
                }`}
              >
                <Upload className="w-12 h-12" />
              </div>

              {/* Gallery Images Badge */}
              {project.images && project.images.length > 0 && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  +{project.images.length} more
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {project.tech_stack?.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Gallery Images Preview (if any) */}
              {project.images && project.images.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Gallery images ({project.images.length})
                  </p>
                  <div className="flex gap-1 overflow-x-auto pb-2">
                    {project.images.map((imageUrl, index) => (
                      <div key={index} className="relative group shrink-0">
                        <img
                          src={getOptimizedImageWithProfile(
                            imageUrl,
                            "galleryThumb"
                          )}
                          alt={`Gallery image ${index + 1}`}
                          className="w-12 h-12 object-cover rounded border border-gray-300 dark:border-gray-600"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-1">
                            <button
                              onClick={() =>
                                handleSetMainImage(project.id, imageUrl)
                              }
                              className="bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                              title="Set as main image"
                            >
                              ★
                            </button>
                            <button
                              onClick={() =>
                                handleRemoveGalleryImage(project.id, index)
                              }
                              className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        {project.image_url === imageUrl && (
                          <div className="absolute top-0 left-0 bg-blue-500 text-white rounded-full w-3 h-3 text-[8px] flex items-center justify-center">
                            ★
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Edit2}
                    onClick={() => handleEditProject(project)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    Delete
                  </Button>
                </div>
                <div className="flex space-x-2">
                  {project.live_demo && (
                    <a
                      href={project.live_demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      aria-label={`View live demo of ${project.title}`}
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No projects yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get started by creating your first project
          </p>
          <Button icon={Plus} onClick={handleCreateProject}>
            Create Project
          </Button>
        </div>
      )}

      {/* Project Form Modal */}
      <Modal
        name="project-form"
        title={editingProject ? "Edit Project" : "Create Project"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Project Title *"
            placeholder="My Awesome Project"
            error={errors.title?.message}
            {...register("title")}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your project, what it does, and what technologies you used..."
              error={errors.description?.message}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <Input
            label="Tech Stack *"
            placeholder="React, Node.js, MongoDB, Tailwind CSS"
            helperText="Separate technologies with commas"
            error={errors.techStack?.message}
            {...register("techStack")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Live Demo URL"
              placeholder="https://your-project.com"
              error={errors.liveUrl?.message}
              {...register("liveUrl")}
            />
            <Input
              label="GitHub Link"
              placeholder="https://github.com/your/project"
              error={errors.githubUrl?.message}
              {...register("githubUrl")}
            />
          </div>

          {/* Main Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Main Project Image (for cards)
            </label>

            {/* Optimized Image Preview */}
            {(imagePreview || watch("image_url")) && (
              <div className="mb-4 relative">
                <img
                  src={
                    imagePreview ||
                    getOptimizedImageUrl(watch("image_url"), {
                      width: 600,
                      height: 240,
                      quality: "90",
                    })
                  }
                  alt="Project preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  loading="eager"
                  decoding="sync"
                  width="600"
                  height="240"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* File Input */}
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="project-image"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, WEBP (MAX. 5MB)
                  </p>
                </div>
                <input
                  id="project-image"
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleImageSelect}
                />
              </label>
            </div>

            {/* File Status */}
            {imageFile && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                ✓ Main image selected: {imageFile.name}
              </p>
            )}
          </div>

          {/* Gallery Images Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gallery Images (for modal carousel)
            </label>

            {/* Gallery Files Preview */}
            {galleryFiles.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {galleryFiles.length} image(s) ready to upload:
                </p>
                <div className="flex flex-wrap gap-2">
                  {galleryFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Gallery preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryFile(index)}
                        className="absolute -top-1 -right-1 p-0.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        aria-label="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery File Input */}
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="gallery-images"
                className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-3 pb-4">
                  <Upload className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Add gallery images</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Multiple files allowed
                  </p>
                </div>
                <input
                  id="gallery-images"
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  multiple
                  onChange={handleGallerySelect}
                />
              </label>
            </div>

            {/* Existing Gallery Images (when editing) */}
            {editingProject?.images && editingProject.images.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Existing Gallery Images ({editingProject.images.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {editingProject.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={getOptimizedImageWithProfile(
                          imageUrl,
                          "galleryThumb"
                        )}
                        alt={`Gallery image ${index + 1}`}
                        className="w-12 h-12 object-cover rounded border border-gray-300 dark:border-gray-600"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleSetMainImage(editingProject.id, imageUrl)
                            }
                            className="bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                            title="Set as main image"
                          >
                            ★
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveGalleryImage(editingProject.id, index)
                            }
                            className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      {editingProject.image_url === imageUrl && (
                        <div className="absolute top-0 left-0 bg-blue-500 text-white rounded-full w-3 h-3 text-[8px] flex items-center justify-center">
                          ★
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              loading={createProject.isPending || updateProject.isPending}
              className="flex-1"
            >
              {editingProject ? "Update Project" : "Create Project"}
            </Button>
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectManagement;
