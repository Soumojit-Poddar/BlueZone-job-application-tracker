import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/dal";
import { Nav } from "@/components/Nav";
import { InterviewForm } from "@/components/InterviewForm";
import { createInterview } from "@/lib/actions/interviews";

export default async function NewInterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();

  const application = await prisma.application.findUnique({
    where: { id, userId: user!.id },
    select: { id: true, company: true },
  });

  if (!application) {
    notFound();
  }

  const createWithApplicationId = createInterview.bind(null, application.id);

  return (
    <div>
      <Nav />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link
          href={`/applications/${application.id}`}
          className="text-sm text-gray-500 hover:underline"
        >
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">
          Add interview — {application.company}
        </h1>
        <div className="mt-6">
          <InterviewForm action={createWithApplicationId} submitLabel="Add interview" />
        </div>
      </div>
    </div>
  );
}