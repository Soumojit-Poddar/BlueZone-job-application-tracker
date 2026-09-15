"use client";

import { useActionState } from "react";
import type { InterviewFormState } from "@/lib/definitions";

type InterviewFormProps = {
  action: (
    state: InterviewFormState,
    formData: FormData
  ) => Promise<InterviewFormState>;
  defaultValues?: {
    round: string;
    interviewDate: string;
    interviewType: string;
    notes: string | null;
    result: string;
  };
  submitLabel: string;
};

const RESULTS = ["PENDING", "PASSED", "FAILED", "RESCHEDULED"];

export function InterviewForm({
  action,
  defaultValues,
  submitLabel,
}: InterviewFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="round" className="block text-sm font-medium text-gray-700">
            Round *
          </label>
          <input
            id="round"
            name="round"
            defaultValue={defaultValues?.round}
            placeholder="e.g. Technical Round 1"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {state?.errors?.round && (
            <p className="mt-1 text-sm text-red-600">{state.errors.round[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="interviewType" className="block text-sm font-medium text-gray-700">
            Type *
          </label>
          <input
            id="interviewType"
            name="interviewType"
            defaultValue={defaultValues?.interviewType}
            placeholder="e.g. Video Call, Phone, In-person"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {state?.errors?.interviewType && (
            <p className="mt-1 text-sm text-red-600">{state.errors.interviewType[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="interviewDate" className="block text-sm font-medium text-gray-700">
            Date *
          </label>
          <input
            id="interviewDate"
            name="interviewDate"
            type="date"
            defaultValue={defaultValues?.interviewDate}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {state?.errors?.interviewDate && (
            <p className="mt-1 text-sm text-red-600">{state.errors.interviewDate[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="result" className="block text-sm font-medium text-gray-700">
            Result
          </label>
          <select
            id="result"
            name="result"
            defaultValue={defaultValues?.result ?? "PENDING"}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {RESULTS.map((result) => (
              <option key={result} value={result}>
                {result}
              </option>
            ))}
          </select>
        </div>
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