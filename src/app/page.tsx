import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">JobTrackr</span>
          <nav className="flex gap-3">
            <Link
              href="/login"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Track every job application in one place
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-500">
          Stop losing track of applications across spreadsheets and email
          threads. Manage your entire job search — applications, interviews,
          and follow-ups — from a single dashboard.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/register"
            className="rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Log in
          </Link>
        </div>

        <div className="mt-20 grid gap-8 text-left sm:grid-cols-3">
          <div>
            <h3 className="font-semibold text-gray-900">Kanban pipeline</h3>
            <p className="mt-1 text-sm text-gray-500">
              Visualize every application&apos;s stage, from saved to offer.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Interview tracking</h3>
            <p className="mt-1 text-sm text-gray-500">
              Log every round, result, and note for each application.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Never miss a follow-up</h3>
            <p className="mt-1 text-sm text-gray-500">
              See upcoming follow-ups and interviews at a glance.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}