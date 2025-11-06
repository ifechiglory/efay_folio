// src/components/admin/SkillsManagement.jsx - Clean version
import { useState } from 'react';
import { Plus, Edit2, Trash2, Star, Cog } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skillSchema } from '../../types/schemas';
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '../../hooks/useSkills';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { useUIStore } from '../../stores/uiStore';

const SkillsManagement = () => {
  const [editingSkill, setEditingSkill] = useState(null);
  const { openModal, closeModal, addToast } = useUIStore();
  
  const { data: skills = [], isLoading } = useSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(skillSchema),
  });

  const categories = ['Frontend', 'Backend', 'Tools', 'Soft Skills', 'Other'];

  const handleCreateSkill = () => {
    setEditingSkill(null);
    reset();
    openModal('skill-form');
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    reset(skill);
    openModal('skill-form');
  };

  const onSubmit = async (data) => {
    try {
      console.log('Form data:', data);
      
      // Convert proficiency to number
      const skillData = {
        name: data.name,
        category: data.category,
        proficiency: parseInt(data.proficiency),
        icon: data.icon || null,
        featured: data.featured || false,
      };

      console.log('Saving skill data:', skillData);

      if (editingSkill) {
        await updateSkill.mutateAsync({
          id: editingSkill.id,
          updates: skillData
        });
        addToast({
          type: 'success',
          message: 'Skill updated successfully!',
          autoHide: true,
        });
      } else {
        await createSkill.mutateAsync(skillData);
        addToast({
          type: 'success',
          message: 'Skill added successfully!',
          autoHide: true,
        });
      }
      
      closeModal();
      reset();
    } catch (error) {
      console.error('Error saving skill:', error);
      addToast({
        type: 'error',
        message: `Failed to save skill: ${error.message}`,
        autoHide: true,
      });
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteSkill.mutateAsync(skillId);
        addToast({
          type: 'success',
          message: 'Skill deleted successfully!',
          autoHide: true,
        });
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Failed to delete skill. Please try again.',
          autoHide: true,
        });
      }
    }
  };

  const getProficiencyBars = (proficiency) => {
    return Array.from({ length: 10 }, (_, i) => (
      <div
        key={i}
        className={`w-1.5 h-2 rounded-sm ${
          i < proficiency 
            ? 'bg-blue-500' 
            : 'bg-gray-300 dark:bg-gray-600'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading skills...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Cog className="w-6 h-6 mr-2 text-blue-600" />
            Skills Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your technical skills</p>
        </div>
        <Button icon={Plus} onClick={handleCreateSkill}>
          Add Skill
        </Button>
      </div>

      {/* Skills by Category */}
      <div className="space-y-8">
        {categories.map((category) => {
          const categorySkills = skills.filter(skill => skill.category === category);
          if (categorySkills.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {skill.name}
                      </h4>
                      {skill.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 mb-3">
                      {getProficiencyBars(skill.proficiency)}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Level {skill.proficiency}/10
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit2}
                          onClick={() => handleEditSkill(skill)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDeleteSkill(skill.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {skills.length === 0 && (
        <div className="text-center py-12">
          <Cog className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No skills yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get started by adding your first skill
          </p>
          <Button icon={Plus} onClick={handleCreateSkill}>
            Add Skill
          </Button>
        </div>
      )}

      {/* Skill Form Modal */}
      <Modal name="skill-form" title={editingSkill ? 'Edit Skill' : 'Add Skill'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Skill Name *"
            error={errors.name?.message}
            {...register('name')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('category')}
              defaultValue=""
            >
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Proficiency Level (1-10) *
            </label>
            <input
              type="number"
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('proficiency', { valueAsNumber: true })}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 = Beginner</span>
              <span>10 = Expert</span>
            </div>
            {errors.proficiency && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.proficiency.message}
              </p>
            )}
          </div>

          <Input
            label="Icon URL (optional)"
            placeholder="https://example.com/icon.svg"
            error={errors.icon?.message}
            {...register('icon')}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register('featured')}
            />
            <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">
              Featured Skill
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              loading={createSkill.isPending || updateSkill.isPending}
              className="flex-1"
            >
              {editingSkill ? 'Update Skill' : 'Add Skill'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SkillsManagement;