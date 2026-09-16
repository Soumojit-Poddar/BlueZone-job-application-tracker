"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logged server-side for debugging — never shown to the user.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F4F6F9] px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-red-400">
        Error
      </p>
      <h1 className="text-2xl font-semibold text-gray-900">
        Something went wrong
      </h1>
      <p className="max-w-sm text-sm text-gray-500">
        An unexpected error occurred. It&apos;s been logged — please try
        again.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}