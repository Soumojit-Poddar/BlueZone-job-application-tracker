"use client";

import { useState, useTransition } from "react";
import { deleteInterview } from "@/lib/actions/interviews";
import { TrashIcon } from "@/components/icons";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export function DeleteInterviewButton({
  interviewId,
  applicationId,
  round,
}: {
  interviewId: string;
  applicationId: string;
  round: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await deleteInterview(interviewId, applicationId);
      setIsModalOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Delete interview"
        title="Delete"
        className="rounded-md p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700"
      >
        <TrashIcon className="h-3.5 w-3.5" />
      </button>

      <ConfirmDialog
        open={isModalOpen}
        title="Delete interview?"
        description={
          <>
            This will permanently delete the{" "}
            <span className="font-medium text-gray-900">{round}</span> interview.
            This cannot be undone.
          </>
        }
        isPending={isPending}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}