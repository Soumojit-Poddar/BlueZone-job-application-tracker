"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import {
  ApplicationFormSchema,
  type ApplicationFormState,
} from "@/lib/definitions";
import type { ApplicationStatus } from "@/generated/prisma/enums";

function parseApplicationFormData(formData: FormData) {
  return {
    company: formData.get("company"),
    jobTitle: formData.get("jobTitle"),
    jobType: formData.get("jobType"),
    location: formData.get("location"),
    salary: formData.get("salary"),
    jobUrl: formData.get("jobUrl"),
    jobDescription: formData.get("jobDescription"),
    status: formData.get("status"),
    appliedAt: formData.get("appliedAt"),
    followUpDate: formData.get("followUpDate"),
    notes: formData.get("notes"),
    isFavorite: formData.get("isFavorite") === "on",
  };
}

export async function createApplication(
  state: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  const session = await verifySession();

  const validatedFields = ApplicationFormSchema.safeParse(
    parseApplicationFormData(formData)
  );

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const data = validatedFields.data;

  await prisma.application.create({
    data: {
      company: data.company,
      jobTitle: data.jobTitle,
      jobType: data.jobType,
      location: data.location || null,
      salary: data.salary || null,
      jobUrl: data.jobUrl || null,
      jobDescription: data.jobDescription || null,
      status: data.status,
      appliedAt: data.appliedAt ? new Date(data.appliedAt) : null,
      followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
      notes: data.notes || null,
      isFavorite: data.isFavorite ?? false,
      userId: session.userId,
    },
  });

  revalidatePath("/applications");
  redirect("/applications");
}

export async function updateApplication(
  applicationId: string,
  state: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  const session = await verifySession();

  const validatedFields = ApplicationFormSchema.safeParse(
    parseApplicationFormData(formData)
  );

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const data = validatedFields.data;

  try {
    await prisma.application.update({
      // This IS the ownership check — see the explanation below.
      where: { id: applicationId, userId: session.userId },
      data: {
        company: data.company,
        jobTitle: data.jobTitle,
        jobType: data.jobType,
        location: data.location || null,
        salary: data.salary || null,
        jobUrl: data.jobUrl || null,
        jobDescription: data.jobDescription || null,
        status: data.status,
        appliedAt: data.appliedAt ? new Date(data.appliedAt) : null,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        notes: data.notes || null,
        isFavorite: data.isFavorite ?? false,
      },
    });
  } catch {
    return { message: "Application not found." };
  }

  revalidatePath("/applications");
  redirect("/applications");
}

export async function deleteApplication(applicationId: string) {
  const session = await verifySession();

  await prisma.application
    .delete({
      where: { id: applicationId, userId: session.userId },
    })
    .catch(() => {
      // Didn't exist, or wasn't this user's — either way, nothing more to do.
    });

  revalidatePath("/applications");
}

const VALID_STATUSES: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

function isValidStatus(value: string): value is ApplicationStatus {
  return VALID_STATUSES.includes(value as ApplicationStatus);
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string
) {
  const session = await verifySession();

  if (!isValidStatus(status)) {
    throw new Error("Invalid status value.");
  }

  await prisma.application.update({
    where: { id: applicationId, userId: session.userId },
    data: { status },
  });

  revalidatePath(`/applications/${applicationId}`);
  revalidatePath("/applications");
  revalidatePath("/kanban");
}

export async function toggleFavorite(applicationId: string, currentValue: boolean) {
  const session = await verifySession();

  await prisma.application.update({
    where: { id: applicationId, userId: session.userId },
    data: { isFavorite: !currentValue },
  });

  revalidatePath(`/applications/${applicationId}`);
  revalidatePath("/applications");
}