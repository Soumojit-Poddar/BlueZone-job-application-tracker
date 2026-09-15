"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import {
    InterviewFormSchema,
    type InterviewFormState,
} from "@/lib/definitions";

function parseInterviewFormData(formData: FormData) {
    return {
        round: formData.get("round"),
        interviewDate: formData.get("interviewDate"),
        interviewType: formData.get("interviewType"),
        notes: formData.get("notes"),
        result: formData.get("result"),
    };
}

export async function createInterview(
    applicationId: string,
    state: InterviewFormState,
    formData: FormData
): Promise<InterviewFormState> {
    const session = await verifySession();

    // Ownership check #1: does this application actually belong to me?
    const application = await prisma.application.findUnique({
        where: { id: applicationId, userId: session.userId },
        select: { id: true },
    });

    if (!application) {
        return { message: "Application not found." };
    }

    const validatedFields = InterviewFormSchema.safeParse(
        parseInterviewFormData(formData)
    );

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }

    const data = validatedFields.data;

    await prisma.interview.create({
        data: {
            applicationId,
            round: data.round,
            interviewDate: new Date(data.interviewDate),
            interviewType: data.interviewType,
            notes: data.notes || null,
            result: data.result,
        },
    });

    revalidatePath(`/applications/${applicationId}`);
    redirect(`/applications/${applicationId}`);
}

export async function updateInterview(
    interviewId: string,
    applicationId: string,
    state: InterviewFormState,
    formData: FormData
): Promise<InterviewFormState> {
    const session = await verifySession();

    // Ownership check: walk up from the interview to its application's owner.
    const owned = await prisma.interview.findFirst({
        where: { id: interviewId, application: { userId: session.userId } },
        select: { id: true },
    });

    if (!owned) {
        return { message: "Interview not found." };
    }

    const validatedFields = InterviewFormSchema.safeParse(
        parseInterviewFormData(formData)
    );

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }

    const data = validatedFields.data;

    await prisma.interview.update({
        where: { id: interviewId },
        data: {
            round: data.round,
            interviewDate: new Date(data.interviewDate),
            interviewType: data.interviewType,
            notes: data.notes || null,
            result: data.result,
        },
    });

    revalidatePath(`/applications/${applicationId}`);
    redirect(`/applications/${applicationId}`);
}

export async function deleteInterview(interviewId: string, applicationId: string) {
    const session = await verifySession();

    const owned = await prisma.interview.findFirst({
        where: { id: interviewId, application: { userId: session.userId } },
        select: { id: true },
    });

    if (!owned) {
        return; // Not theirs (or doesn't exist) — nothing to do.
    }

    await prisma.interview.delete({ where: { id: interviewId } });
    revalidatePath(`/applications/${applicationId}`);
}