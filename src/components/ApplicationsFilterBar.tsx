"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const STATUSES = [
  "SAVED",
  "APPLIED",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];
const JOB_TYPES = ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT", "FREELANCE"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest application" },
  { value: "oldest", label: "Oldest application" },
  { value: "company", label: "Company name" },
  { value: "jobTitle", label: "Job title" },
  { value: "followUpDate", label: "Follow-up date" },
];

export function ApplicationsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

  function updateParams(updates: Record<string, string | null>, resetPage = true) {
    const newParams = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    }
    if (resetPage) {
      newParams.delete("page");
    }
    startTransition(() => {
      router.push(`${pathname}?${newParams.toString()}`);
    });
  }

  // Debounce the search box — wait 400ms after typing stops before touching the URL/database
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== (searchParams.get("q") ?? "")) {
        updateParams({ q: searchInput || null });
      }
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const hasActiveFilters =
    searchParams.get("q") ||
    searchParams.get("status") ||
    searchParams.get("jobType") ||
    searchParams.get("favorite") ||
    searchParams.get("appliedFrom") ||
    searchParams.get("appliedTo");

  return (
    <div
      className={`flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-opacity ${
        isPending ? "opacity-60" : ""
      }`}
    >
      <div className="min-w-[200px] flex-1">
        <label className="block text-xs font-medium text-gray-500">Search</label>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Company, role, or location..."
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500">Status</label>
        <select
          value={searchParams.get("status") ?? ""}
          onChange={(e) => updateParams({ status: e.target.value || null })}
          className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500">Job type</label>
        <select
          value={searchParams.get("jobType") ?? ""}
          onChange={(e) => updateParams({ jobType: e.target.value || null })}
          className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All</option>
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500">Applied from</label>
        <input
          type="date"
          value={searchParams.get("appliedFrom") ?? ""}
          onChange={(e) => updateParams({ appliedFrom: e.target.value || null })}
          className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500">Applied to</label>
        <input
          type="date"
          value={searchParams.get("appliedTo") ?? ""}
          onChange={(e) => updateParams({ appliedTo: e.target.value || null })}
          className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500">Sort by</label>
        <select
          value={searchParams.get("sort") ?? "newest"}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 pb-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={searchParams.get("favorite") === "true"}
          onChange={(e) => updateParams({ favorite: e.target.checked ? "true" : null })}
          className="h-4 w-4 rounded border-gray-300"
        />
        Favorites only
      </label>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            setSearchInput("");
            router.push(pathname);
          }}
          className="pb-2 text-sm text-gray-500 underline hover:text-gray-900"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}