import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/dal";
import { Nav } from "@/components/Nav";
import { ApplicationForm } from "@/components/ApplicationForm";
import { updateApplication } from "@/lib/actions/applications";
import Link from "next/link";

export default async function EditApplicationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const user = await getUser();

    const application = await prisma.application.findUnique({
        where: { id, userId: user!.id },
    });

    if (!application) {
        notFound();
    }

    const updateWithId = updateApplication.bind(null, application.id);

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
                    Edit application
                </h1>
                <div className="mt-6">
                    <ApplicationForm
                        action={updateWithId}
                        submitLabel="Save changes"
                        defaultValues={{
                            company: application.company,
                            jobTitle: application.jobTitle,
                            jobType: application.jobType,
                            location: application.location,
                            salary: application.salary,
                            jobUrl: application.jobUrl,
                            jobDescription: application.jobDescription,
                            status: application.status,
                            appliedAt: application.appliedAt
                                ? application.appliedAt.toISOString().split("T")[0]
                                : null,
                            followUpDate: application.followUpDate
                                ? application.followUpDate.toISOString().split("T")[0]
                                : null,
                            notes: application.notes,
                            isFavorite: application.isFavorite,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}