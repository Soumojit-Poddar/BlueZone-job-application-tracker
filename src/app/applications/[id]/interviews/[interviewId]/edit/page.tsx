import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/dal";
import { Nav } from "@/components/Nav";
import { InterviewForm } from "@/components/InterviewForm";
import { updateInterview } from "@/lib/actions/interviews";

export default async function EditInterviewPage({
  params,
}: {
  params: Promise<{ id: string; interviewId: string }>;
}) {
  const { id, interviewId } = await params;
  const user = await getUser();

  const interview = await prisma.interview.findFirst({
    where: {
      id: interviewId,
      applicationId: id,
      application: { userId: user!.id },
    },
  });

  if (!interview) {
    notFound();
  }

  const updateWithIds = updateInterview.bind(null, interview.id, id);

  return (
    <div>
      <Nav />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link
          href={`/applications/${id}`}
          className="text-sm text-gray-500 hover:underline"
        >
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">Edit interview</h1>
        <div className="mt-6">
          <InterviewForm
            action={updateWithIds}
            submitLabel="Save changes"
            defaultValues={{
              round: interview.round,
              interviewDate: interview.interviewDate.toISOString().split("T")[0],
              interviewType: interview.interviewType,
              notes: interview.notes,
              result: interview.result,
            }}
          />
        </div>
      </div>
    </div>
  );
}