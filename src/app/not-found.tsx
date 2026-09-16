import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F4F6F9] px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
        404
      </p>
      <h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
      <p className="max-w-sm text-sm text-gray-500">
        This page doesn&apos;t exist, or you don&apos;t have access to it.
      </p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
      >
        Back to dashboard
      </Link>
    </div>
  );
}