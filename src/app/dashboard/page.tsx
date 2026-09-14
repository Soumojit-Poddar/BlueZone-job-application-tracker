import { getUser } from "@/lib/dal";
import { logout } from "@/lib/actions/auth";

export default async function DashboardPage() {
  const user = await getUser();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome, {user?.name}
        </h1>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Log out
          </button>
        </form>
      </div>
      <p className="mt-4 text-gray-500">
        This is a placeholder — the real dashboard (stats, recent
        applications, upcoming interviews) gets built in Phase 8.
      </p>
    </div>
  );
}