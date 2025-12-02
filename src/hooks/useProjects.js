import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lib/supabase";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData) => {
      const { data, error } = await supabase
        .from("projects")
        .insert([projectData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// NEW: Project Images Management Functions

/**
 * Update project images array
 */
export const useUpdateProjectImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, images }) => {
      const { data, error } = await supabase
        .from("projects")
        .update({
          images,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

/**
 * Add images to existing project (append to images array)
 */
export const useAddProjectImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, newImages }) => {
      // First get current project to access existing images
      const { data: project, error: fetchError } = await supabase
        .from("projects")
        .select("images")
        .eq("id", projectId)
        .single();

      if (fetchError) throw fetchError;

      const currentImages = project?.images || [];
      const updatedImages = [...currentImages, ...newImages];

      // Update with combined images array
      const { data, error } = await supabase
        .from("projects")
        .update({
          images: updatedImages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

/**
 * Remove specific image from project images array
 */
export const useRemoveProjectImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, imageIndex }) => {
      // First get current project to access existing images
      const { data: project, error: fetchError } = await supabase
        .from("projects")
        .select("images")
        .eq("id", projectId)
        .single();

      if (fetchError) throw fetchError;

      const currentImages = project?.images || [];
      const updatedImages = currentImages.filter(
        (_, index) => index !== imageIndex
      );

      // Update with filtered images array
      const { data, error } = await supabase
        .from("projects")
        .update({
          images: updatedImages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

/**
 * Reorder project images
 */
export const useReorderProjectImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, reorderedImages }) => {
      const { data, error } = await supabase
        .from("projects")
        .update({
          images: reorderedImages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

/**
 * Set main project image (image_url) from images array
 */
export const useSetMainProjectImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, imageUrl }) => {
      const { data, error } = await supabase
        .from("projects")
        .update({
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
