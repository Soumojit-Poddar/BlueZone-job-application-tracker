"use client";

import { useActionState } from "react";
import type { ApplicationFormState } from "@/lib/definitions";

type ApplicationFormProps = {
  action: (
    state: ApplicationFormState,
    formData: FormData
  ) => Promise<ApplicationFormState>;
  defaultValues?: {
    company: string;
    jobTitle: string;
    jobType: string;
    location: string | null;
    salary: string | null;
    jobUrl: string | null;
    jobDescription: string | null;
    status: string;
    appliedAt: string | null;
    followUpDate: string | null;
    notes: string | null;
    isFavorite: boolean;
  };
  submitLabel: string;
};

const JOB_TYPES = ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT", "FREELANCE"];
const STATUSES = [
  "SAVED",
  "APPLIED",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

export function ApplicationForm({
  action,
  defaultValues,
  submitLabel,
}: ApplicationFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company *
          </label>
          <input
            id="company"
            name="company"
            defaultValue={defaultValues?.company}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {state?.errors?.company && (
            <p className="mt-1 text-sm text-red-600">{state.errors.company[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
            Job title *
          </label>
          <input
            id="jobTitle"
            name="jobTitle"
            defaultValue={defaultValues?.jobTitle}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {state?.errors?.jobTitle && (
            <p className="mt-1 text-sm text-red-600">{state.errors.jobTitle[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
            Job type *
          </label>
          <select
            id="jobType"
            name="jobType"
            defaultValue={defaultValues?.jobType ?? "FULL_TIME"}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status *
          </label>
          <select
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? "SAVED"}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            id="location"
            name="location"
            defaultValue={defaultValues?.location ?? ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
            Salary
          </label>
          <input
            id="salary"
            name="salary"
            defaultValue={defaultValues?.salary ?? ""}
            placeholder="e.g. ₹8-12 LPA"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700">
            Job URL
          </label>
          <input
            id="jobUrl"
            name="jobUrl"
            defaultValue={defaultValues?.jobUrl ?? ""}
            placeholder="https://..."
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {state?.errors?.jobUrl && (
            <p className="mt-1 text-sm text-red-600">{state.errors.jobUrl[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="appliedAt" className="block text-sm font-medium text-gray-700">
            Application date
          </label>
          <input
            id="appliedAt"
            name="appliedAt"
            type="date"
            defaultValue={defaultValues?.appliedAt ?? ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700">
            Follow-up date
          </label>
          <input
            id="followUpDate"
            name="followUpDate"
            type="date"
            defaultValue={defaultValues?.followUpDate ?? ""}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
          Job description
        </label>
        <textarea
          id="jobDescription"
          name="jobDescription"
          rows={4}
          defaultValue={defaultValues?.jobDescription ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={defaultValues?.notes ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isFavorite"
          name="isFavorite"
          type="checkbox"
          defaultChecked={defaultValues?.isFavorite}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="isFavorite" className="text-sm text-gray-700">
          Mark as favorite
        </label>
      </div>

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}