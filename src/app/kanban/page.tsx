import { getUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { Nav } from "@/components/Nav";
import { KanbanBoard } from "@/components/KanbanBoard";
import type { ApplicationStatus } from "@/generated/prisma/enums";

const STATUSES: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

export default async function KanbanPage() {
  const user = await getUser();

  const applications = await prisma.application.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      company: true,
      jobTitle: true,
      location: true,
      isFavorite: true,
      status: true,
    },
  });

  const initialColumns: Record<string, typeof applications> = {};
  for (const status of STATUSES) {
    initialColumns[status] = applications.filter((app) => app.status === status);
  }

  return (
    <div>
      <Nav />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-semibold text-gray-900">Kanban Board</h1>
        <p className="mt-1 text-sm text-gray-500">
          Drag a card between columns, or use the dropdown on any card, to
          change its status.
        </p>
        <div className="mt-6">
          <KanbanBoard initialColumns={initialColumns} />
        </div>
      </div>
    </div>
  );
}