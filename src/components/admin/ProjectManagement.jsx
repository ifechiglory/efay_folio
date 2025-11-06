// src/components/admin/ProjectManagement.jsx - Fixed version
import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Upload, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '../../types/schemas';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../../hooks/useProjects';
import { uploadToCloudinary } from '../../lib/cloudinary';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { useUIStore } from '../../stores/uiStore';

const ProjectManagement = () => {
  const [editingProject, setEditingProject] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { openModal, closeModal, addToast } = useUIStore();

  const { data: projects = [], isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  const handleCreateProject = () => {
    setEditingProject(null);
    reset();
    setImageFile(null);
    setImagePreview(null);
    openModal("project-form");
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    reset(project);
    setImagePreview(project.image_url || null);
    openModal("project-form");
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
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

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = editingProject?.image_url || "";

      // Upload image to Cloudinary if a new file is selected
      if (imageFile) {
        addToast({
          type: "info",
          message: "Uploading image...",
          autoHide: false,
        });

        try {
          imageUrl = await uploadToCloudinary(imageFile);
          addToast({
            type: "success",
            message: "Image uploaded successfully!",
            autoHide: true,
          });
        } catch (error) {
          console.error("Image upload failed:", error);
          addToast({
            type: "error",
            message: "Failed to upload image. Please try again.",
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
      };

      console.log("Saving project data:", projectData);

      if (editingProject) {
        await updateProject.mutateAsync({
          id: editingProject.id,
          updates: projectData,
        });
        addToast({
          type: "success",
          message: "Project updated successfully!",
          autoHide: true,
        });
      } else {
        await createProject.mutateAsync(projectData);
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
            {/* Project Image */}
            <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
              {project.image_url ? (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Upload className="w-12 h-12" />
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

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Image
            </label>

            {/* Image Preview */}
            {(imagePreview || watch("image_url")) && (
              <div className="mb-4 relative">
                <img
                  src={imagePreview || watch("image_url")}
                  alt="Project preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
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
                ✓ Image selected: {imageFile.name} (will upload when you save)
              </p>
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