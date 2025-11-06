import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  techStack: z.string().min(1, "At least one technology is required"),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().min(1, "Category is required"), // This should prevent null/empty
  proficiency: z.number().min(1).max(10),
  icon: z.string().optional(),
  featured: z.boolean().default(false),
});

export const experienceSchema = z
  .object({
    company: z.string().min(1, "Company name is required"),
    position: z.string().min(1, "Position is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(), // Make it optional
    current: z.boolean().default(false),
    description: z.string().min(1, "Description is required"),
    skills: z.string().min(1, "At least one skill is required"),
  })
  .refine(
    (data) => {
      // If current is false, endDate is required
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required when not currently working here",
      path: ["endDate"], // This shows the error on the endDate field
    }
  );

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});