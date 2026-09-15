import * as z from "zod";

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long." })
    .trim(),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { error: "Password must contain at least one letter." })
    .regex(/[0-9]/, { error: "Password must contain at least one number." })
    .trim(),
});

export type SignupFormState =
  | {
    errors?: {
      name?: string[];
      email?: string[];
      password?: string[];
    };
    message?: string;
  }
  | undefined;

export const LoginFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z.string().min(1, { error: "Password is required." }),
});

export type LoginFormState =
  | {
    errors?: {
      email?: string[];
      password?: string[];
    };
    message?: string;
  }
  | undefined;

export type SessionPayload = {
  sessionId: string;
  expiresAt: number;
};

export const ApplicationFormSchema = z.object({
  company: z.string().trim().min(1, { error: "Company is required." }),
  jobTitle: z.string().trim().min(1, { error: "Job title is required." }),
  jobType: z.enum(
    ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT", "FREELANCE"],
    { error: "Please select a job type." }
  ),
  location: z.string().trim().optional(),
  salary: z.string().trim().optional(),
  jobUrl: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      error: "Job URL must start with http:// or https://",
    }),
  jobDescription: z.string().trim().optional(),
  status: z.enum(
    ["SAVED", "APPLIED", "ASSESSMENT", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"],
    { error: "Please select a status." }
  ),
  appliedAt: z.string().trim().optional(),
  followUpDate: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  isFavorite: z.boolean().optional(),
});

export type ApplicationFormState =
  | {
    errors?: {
      company?: string[];
      jobTitle?: string[];
      jobType?: string[];
      location?: string[];
      salary?: string[];
      jobUrl?: string[];
      jobDescription?: string[];
      status?: string[];
      appliedAt?: string[];
      followUpDate?: string[];
      notes?: string[];
    };
    message?: string;
  }
  | undefined;

export const InterviewFormSchema = z.object({
  round: z.string().trim().min(1, { error: "Round is required." }),
  interviewDate: z
    .string()
    .trim()
    .min(1, { error: "Interview date is required." }),
  interviewType: z
    .string()
    .trim()
    .min(1, { error: "Interview type is required." }),
  notes: z.string().trim().optional(),
  result: z.enum(["PENDING", "PASSED", "FAILED", "RESCHEDULED"], {
    error: "Please select a result.",
  }),
});

export type InterviewFormState =
  | {
    errors?: {
      round?: string[];
      interviewDate?: string[];
      interviewType?: string[];
      notes?: string[];
      result?: string[];
    };
    message?: string;
  }
  | undefined;