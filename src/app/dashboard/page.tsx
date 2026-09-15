import { getUser } from "@/lib/dal";
import { Nav } from "@/components/Nav";

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div>
      <Nav />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome, {user?.name}
        </h1>
        <p className="mt-4 text-gray-500">
          This is a placeholder — the real dashboard (stats, recent
          applications, upcoming interviews) gets built in Phase 8.
        </p>
      </div>
    </div>
  );
}