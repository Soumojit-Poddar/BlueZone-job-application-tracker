"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteApplication } from "@/lib/actions/applications";
import { TrashIcon } from "@/components/icons";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export function DeleteApplicationButton({
  applicationId,
  companyName,
}: {
  applicationId: string;
  companyName: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleConfirm() {
    startTransition(async () => {
      await deleteApplication(applicationId);
      setIsModalOpen(false);
      router.push("/applications");
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Delete application"
        title="Delete"
        className="rounded-md p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
      >
        <TrashIcon />
      </button>

      <ConfirmDialog
        open={isModalOpen}
        title="Delete application?"
        description={
          <>
            This will permanently delete the application for{" "}
            <span className="font-medium text-gray-900">{companyName}</span>.
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