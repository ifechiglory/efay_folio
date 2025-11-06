// src/stores/projectStore.js
import { create } from 'zustand';

export const useProjectStore = create((set, get) => ({
  projects: [],
  selectedProject: null,
  isUploading: false,

  setProjects: (projects) => set({ projects }),
  
  addProject: (project) => set((state) => ({
    projects: [...state.projects, project]
  })),

  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(project =>
      project.id === id ? { ...project, ...updates } : project
    )
  })),

  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(project => project.id !== id)
  })),

  setSelectedProject: (project) => set({ selectedProject: project }),

  setUploading: (isUploading) => set({ isUploading }),
}));