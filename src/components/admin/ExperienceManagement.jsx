// src/components/admin/ExperienceManagement.jsx
import { useState } from "react";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema } from "../../types/schemas";
import {
  useExperience,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
} from "../../hooks/useExperience";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import { useUIStore } from "../../stores/uiStore";

const ExperienceManagement = () => {
  const [editingExperience, setEditingExperience] = useState(null);
  const { openModal, closeModal, addToast } = useUIStore();

  const { data: experiences = [], isLoading } = useExperience();
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(experienceSchema),
  });

  const watchCurrent = watch("current", false);

  const handleCreateExperience = () => {
    setEditingExperience(null);
    reset();
    openModal("experience-form");
  };

  const handleEditExperience = (experience) => {
    setEditingExperience(experience);

    // Convert existing data for the form
    const formData = {
      ...experience,
      startDate: experience.start_date, // Already in correct format
      endDate: experience.end_date, // Already in correct format
      description: Array.isArray(experience.description)
        ? experience.description.join(" ") // Convert array back to string for form
        : experience.description,
      skills: Array.isArray(experience.skills)
        ? experience.skills.join(", ") // Convert array back to string for form
        : experience.skills,
    };

    reset(formData);
    openModal("experience-form");
  };

  const onSubmit = async (data) => {
    try {
      console.log("🟢 Raw form data:", data);

      // Date inputs now provide proper YYYY-MM-DD format
      const experienceData = {
        company: data.company,
        position: data.position,
        start_date: data.startDate, // Already in YYYY-MM-DD format
        end_date: data.current ? null : data.endDate, // Already in YYYY-MM-DD format
        current: data.current || false,
        description: data.description
          ? data.description
              .split(".")
              .map((sentence) => sentence.trim())
              .filter((sentence) => sentence !== "" && sentence.length > 0)
              .map((sentence) => {
                const trimmed = sentence.trim();
                return trimmed.length > 0 ? trimmed + "." : trimmed;
              })
              .filter((sentence) => sentence !== ".")
          : [],
        skills: data.skills
          ? data.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill !== "")
          : [],
      };

      console.log("🟡 Processed experience data:", experienceData);

      if (editingExperience) {
        await updateExperience.mutateAsync({
          id: editingExperience.id,
          updates: experienceData,
        });
        addToast({
          type: "success",
          message: "Experience updated successfully!",
          autoHide: true,
        });
      } else {
        await createExperience.mutateAsync(experienceData);
        addToast({
          type: "success",
          message: "Experience added successfully!",
          autoHide: true,
        });
      }

      closeModal();
      reset();
    } catch (error) {
      console.error("❌ Error saving experience:", error);
      addToast({
        type: "error",
        message: `Failed to save experience: ${error.message}`,
        autoHide: true,
      });
    }
  };

  // ADD THIS MISSING FUNCTION
  const handleDeleteExperience = async (experienceId) => {
    if (confirm("Are you sure you want to delete this experience entry?")) {
      try {
        await deleteExperience.mutateAsync(experienceId);
        addToast({
          type: "success",
          message: "Experience deleted successfully!",
          autoHide: true,
        });
      } catch (error) {
        console.error("Error deleting experience:", error);
        addToast({
          type: "error",
          message: "Failed to delete experience. Please try again.",
          autoHide: true,
        });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const getDuration = (startDate, endDate, current) => {
    const start = new Date(startDate);
    const end = current ? new Date() : new Date(endDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) return `${remainingMonths} mos`;
    if (remainingMonths === 0) return `${years} yr`;
    return `${years} yr ${remainingMonths} mos`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading experience...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Work Experience
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your professional experience
          </p>
        </div>
        <Button icon={Plus} onClick={handleCreateExperience}>
          Add Experience
        </Button>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <div key={experience.id} className="relative">
            {/* Timeline line */}
            {index !== experiences.length - 1 && (
              <div className="absolute left-6 top-14 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
            )}

            <div className="flex space-x-4">
              {/* Timeline dot */}
              <div className="shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>

              {/* Content */}
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {experience.position}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {experience.company}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Edit2}
                      onClick={() => handleEditExperience(experience)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDeleteExperience(experience.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {/* FIXED: Use Supabase field names (start_date, end_date) instead of form names (startDate, endDate) */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>
                    {formatDate(experience.start_date)} -{" "}
                    {experience.current
                      ? "Present"
                      : formatDate(experience.end_date)}
                  </span>
                  <span>•</span>
                  <span>
                    {getDuration(
                      experience.start_date,
                      experience.end_date,
                      experience.current
                    )}
                  </span>
                </div>

                <ul className="space-y-1 mb-4">
                  {experience.description?.map((point, idx) => (
                    <li
                      key={idx}
                      className="text-gray-600 dark:text-gray-300 text-sm"
                    >
                      • {point}
                    </li>
                  ))}
                </ul>

                {experience.skills && experience.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {experience.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {experiences.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No experience entries yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add your work experience to showcase your career journey
          </p>
          <Button icon={Plus} onClick={handleCreateExperience}>
            Add Experience
          </Button>
        </div>
      )}

      {/* Experience Form Modal */}
      <Modal
        name="experience-form"
        title={editingExperience ? "Edit Experience" : "Add Experience"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Company"
            error={errors.company?.message}
            {...register("company")}
          />

          <Input
            label="Position"
            error={errors.position?.message}
            {...register("position")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date *"
              type="date"
              error={errors.startDate?.message}
              {...register("startDate")}
            />

            <div>
              <Input
                label="End Date"
                type="date"
                disabled={watchCurrent}
                error={errors.endDate?.message}
                {...register("endDate")}
              />
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="current"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...register("current")}
                />
                <label
                  htmlFor="current"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  I currently work here
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (use periods to separate sentences) *
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Developed new features using React and Node.js. Led a team of 3 developers. Improved application performance by 40%."
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
            label="Skills (comma separated) *"
            placeholder="React, Node.js, TypeScript, PostgreSQL"
            helperText="Separate skills with commas. These will be stored as an array."
            error={errors.skills?.message}
            {...register("skills")}
          />

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              loading={createExperience.isPending || updateExperience.isPending}
              className="flex-1"
            >
              {editingExperience ? "Update Experience" : "Add Experience"}
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

export default ExperienceManagement;
