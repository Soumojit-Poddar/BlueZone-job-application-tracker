import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/dal";
import { Nav } from "@/components/Nav";
import { DeleteApplicationButton } from "@/components/DeleteApplicationButton";
import { StatusSelect } from "@/components/StatusSelect";
import { FavoriteButton } from "@/components/FavoriteButton";
import { DeleteInterviewButton } from "@/components/DeleteInterviewButton";
import { EditIcon } from "@/components/icons";

export default async function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();

  const application = await prisma.application.findUnique({
    where: { id, userId: user!.id },
    include: {
      interviews: { orderBy: { interviewDate: "asc" } },
    },
  });

  if (!application) {
    notFound();
  }

  return (
    <div>
      <Nav />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <FavoriteButton
              applicationId={application.id}
              isFavorite={application.isFavorite}
            />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {application.jobTitle}
              </h1>
              <p className="text-gray-500">{application.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/applications/${application.id}/edit`}
              aria-label="Edit application"
              title="Edit"
              className="rounded-md border border-gray-300 p-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <EditIcon />
            </Link>
            <DeleteApplicationButton
              applicationId={application.id}
              companyName={application.company}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Status:</span>
          <StatusSelect
            applicationId={application.id}
            currentStatus={application.status}
          />
        </div>

        <div className="mt-8 grid gap-6 rounded-lg border border-gray-200 bg-white p-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">Job type</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {application.jobType.replace("_", " ")}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">Location</dt>
            <dd className="mt-1 text-sm text-gray-900">{application.location || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">Salary</dt>
            <dd className="mt-1 text-sm text-gray-900">{application.salary || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">Job URL</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {application.jobUrl ? (
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline"
                >
                  View posting
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">
              Application date
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {application.appliedAt
                ? application.appliedAt.toLocaleDateString()
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">
              Follow-up date
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {application.followUpDate
                ? application.followUpDate.toLocaleDateString()
                : "—"}
            </dd>
          </div>
        </div>

        {application.jobDescription && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-medium text-gray-900">Job description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
              {application.jobDescription}
            </p>
          </div>
        )}

        {application.notes && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-medium text-gray-900">Notes</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
              {application.notes}
            </p>
          </div>
        )}

        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-900">Interviews</h2>
            <Link
              href={`/applications/${application.id}/interviews/new`}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              + Add interview
            </Link>
          </div>

          {application.interviews.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">No interviews scheduled yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-200">
              {application.interviews.map((interview) => (
                <li
                  key={interview.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div>
                    <span className="font-medium text-gray-900">{interview.round}</span>{" "}
                    — {interview.interviewDate.toLocaleDateString()} ({interview.result}) ({interview.interviewType})
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/applications/${application.id}/interviews/${interview.id}/edit`}
                      aria-label="Edit interview"
                      title="Edit"
                      className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <EditIcon className="h-3.5 w-3.5" />
                    </Link>
                    <DeleteInterviewButton
                      interviewId={interview.id}
                      applicationId={application.id}
                      round={interview.round}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link
          href="/applications"
          className="mt-6 inline-block text-sm text-gray-500 hover:underline"
        >
          ← Back to applications
        </Link>
      </div>
    </div>
  );
}