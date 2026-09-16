"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function pageHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1">
      <Link
        href={pageHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`rounded-md border px-3 py-1.5 text-sm ${
          currentPage === 1
            ? "pointer-events-none border-gray-200 text-gray-300"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Previous
      </Link>

      {pageNumbers.map((page) => (
        <Link
          key={page}
          href={pageHref(page)}
          className={`rounded-md px-3 py-1.5 text-sm ${
            page === currentPage
              ? "bg-gray-900 font-medium text-white"
              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={pageHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`rounded-md border px-3 py-1.5 text-sm ${
          currentPage === totalPages
            ? "pointer-events-none border-gray-200 text-gray-300"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Next
      </Link>
    </div>
  );
}