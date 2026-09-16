import Link from "next/link";
import { getUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { Nav } from "@/components/Nav";
import { StatCard } from "@/components/StatCard";
import { StatusOverviewBar } from "@/components/StatusOverviewBar";

const TRACKED_STATUSES = [
  "SAVED",
  "APPLIED",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
] as const;

export default async function DashboardPage() {
  const user = await getUser();

  const [statusGroups, recentApplications, upcomingInterviews, upcomingFollowUps] =
    await Promise.all([
      prisma.application.groupBy({
        by: ["status"],
        where: { userId: user!.id },
        _count: { status: true },
      }),
      prisma.application.findMany({
        where: { userId: user!.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.interview.findMany({
        where: {
          interviewDate: { gte: new Date() },
          application: { userId: user!.id },
        },
        orderBy: { interviewDate: "asc" },
        take: 5,
        include: { application: { select: { company: true, jobTitle: true } } },
      }),
      prisma.application.findMany({
        where: {
          userId: user!.id,
          followUpDate: { gte: new Date() },
        },
        orderBy: { followUpDate: "asc" },
        take: 5,
      }),
    ]);

  const statusCounts: Record<string, number> = {};
  let totalApplications = 0;
  for (const group of statusGroups) {
    statusCounts[group.status] = group._count.status;
    totalApplications += group._count.status;
  }

  return (
    <div>
      <Nav />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome, {user?.name}
        </h1>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total" value={totalApplications} />
          {TRACKED_STATUSES.map((status) => (
            <StatCard
              key={status}
              label={status.charAt(0) + status.slice(1).toLowerCase()}
              value={statusCounts[status] ?? 0}
            />
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-medium text-gray-900">Status overview</h2>
          <div className="mt-4">
            <StatusOverviewBar counts={statusCounts} total={totalApplications} />
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-900">Recent applications</h2>
              <Link href="/applications" className="text-xs text-gray-500 hover:underline">
                View all
              </Link>
            </div>
            {recentApplications.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">No applications yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-gray-200">
                {recentApplications.map((app) => (
                  <li key={app.id} className="py-2.5 text-sm">
                    <Link href={`/applications/${app.id}`} className="hover:underline">
                      <span className="font-medium text-gray-900">{app.company}</span>
                      <span className="text-gray-500"> — {app.jobTitle}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-medium text-gray-900">Upcoming interviews</h2>
            {upcomingInterviews.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">No interviews scheduled.</p>
            ) : (
              <ul className="mt-3 divide-y divide-gray-200">
                {upcomingInterviews.map((interview) => (
                  <li key={interview.id} className="py-2.5 text-sm">
                    <span className="font-medium text-gray-900">
                      {interview.application.company}
                    </span>
                    <span className="text-gray-500">
                      {" "}
                      — {interview.round} on{" "}
                      {interview.interviewDate.toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 sm:col-span-2">
            <h2 className="text-sm font-medium text-gray-900">Upcoming follow-ups</h2>
            {upcomingFollowUps.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">No follow-ups scheduled.</p>
            ) : (
              <ul className="mt-3 divide-y divide-gray-200">
                {upcomingFollowUps.map((app) => (
                  <li key={app.id} className="py-2.5 text-sm">
                    <Link href={`/applications/${app.id}`} className="hover:underline">
                      <span className="font-medium text-gray-900">{app.company}</span>
                      <span className="text-gray-500">
                        {" "}
                        — follow up on {app.followUpDate!.toLocaleDateString()}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}