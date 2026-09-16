import Link from "next/link";
import { Suspense } from "react";
import { getUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { Nav } from "@/components/Nav";
import { DeleteApplicationButton } from "@/components/DeleteApplicationButton";
import { ApplicationsFilterBar } from "@/components/ApplicationsFilterBar";
import { Pagination } from "@/components/Pagination";
import type { Prisma } from "@/generated/prisma/client";
import type { ApplicationStatus, JobType } from "@/generated/prisma/enums";
import { EditIcon } from "@/components/icons";

const PAGE_SIZE = 10;

const STATUSES: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];
const JOB_TYPES: JobType[] = ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT", "FREELANCE"];

const SORT_OPTIONS: Record<string, Prisma.ApplicationOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  oldest: { createdAt: "asc" },
  company: { company: "asc" },
  jobTitle: { jobTitle: "asc" },
  followUpDate: { followUpDate: { sort: "asc", nulls: "last" } },
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const user = await getUser();

  const query = params.q?.trim() ?? "";
  const status = STATUSES.includes(params.status as ApplicationStatus)
    ? (params.status as ApplicationStatus)
    : undefined;
  const jobType = JOB_TYPES.includes(params.jobType as JobType)
    ? (params.jobType as JobType)
    : undefined;
  const favoriteOnly = params.favorite === "true";
  const sortKey = params.sort && params.sort in SORT_OPTIONS ? params.sort : "newest";
  const currentPage = Math.max(1, Number(params.page) || 1);

  const where: Prisma.ApplicationWhereInput = { userId: user!.id };

  if (query) {
    where.OR = [
      { company: { contains: query, mode: "insensitive" } },
      { jobTitle: { contains: query, mode: "insensitive" } },
      { location: { contains: query, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status;
  if (jobType) where.jobType = jobType;
  if (favoriteOnly) where.isFavorite = true;

  if (params.appliedFrom || params.appliedTo) {
    where.appliedAt = {
      ...(params.appliedFrom && { gte: new Date(params.appliedFrom) }),
      ...(params.appliedTo && { lte: new Date(params.appliedTo) }),
    };
  }

  const [applications, totalCount] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: SORT_OPTIONS[sortKey],
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.application.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasFilters = Boolean(
    query || status || jobType || favoriteOnly || params.appliedFrom || params.appliedTo
  );

  return (
    <div>
      <Nav />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
          <Link
            href="/applications/new"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Add application
          </Link>
        </div>

        <div className="mt-6">
          <Suspense
            fallback={<div className="h-[74px] rounded-lg border border-gray-200 bg-white" />}
          >
            <ApplicationsFilterBar />
          </Suspense>
        </div>

        {applications.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-gray-300 py-16 text-center">
            <p className="text-gray-500">
              {hasFilters
                ? "No applications match these filters."
                : "You haven't added any applications yet."}
            </p>
            {!hasFilters && (
              <Link
                href="/applications/new"
                className="mt-4 inline-block text-sm font-medium text-gray-900 underline"
              >
                Add your first application
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="mt-4 text-xs text-gray-400">
              {totalCount} application{totalCount !== 1 ? "s" : ""} found
            </p>
            <div className="mt-2 overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Company</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Applied</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <Link href={`/applications/${app.id}`} className="hover:underline">
                          {app.isFavorite && <span className="mr-1 text-yellow-500">★</span>}
                          {app.company}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{app.jobTitle}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {app.appliedAt ? app.appliedAt.toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/applications/${app.id}/edit`}
                            aria-label="Edit application"
                            title="Edit"
                            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                          >
                            <EditIcon />
                          </Link>
                          <DeleteApplicationButton
                            applicationId={app.id}
                            companyName={app.company}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <Suspense fallback={null}>
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
}