"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updateApplicationStatus } from "@/lib/actions/applications";

const STATUSES = [
  "SAVED",
  "APPLIED",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

const COLUMN_LABELS: Record<string, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  ASSESSMENT: "Assessment",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

const STATUS_COLORS: Record<string, string> = {
  SAVED: "bg-[#F517AF]",
  APPLIED: "bg-[#2F52E0]",
  ASSESSMENT: "bg-[#F1A208]",
  INTERVIEW: "bg-[#FA5B1C]",
  OFFER: "bg-[#00FF88]",
  REJECTED: "bg-[#EE0B2D]",
  WITHDRAWN: "bg-[#B7A692]",
};

const COLUMN_ACCENTS: Record<string, string> = STATUS_COLORS;

interface KanbanApplication {
  id: string;
  company: string;
  jobTitle: string;
  location: string | null;
  isFavorite: boolean;
}

export function KanbanBoard({
  initialColumns,
}: {
  initialColumns: Record<string, KanbanApplication[]>;
}) {
  const [columns, setColumns] = useState(initialColumns);
  const [, startTransition] = useTransition();
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null);

  function moveCard(id: string, fromStatus: string, toStatus: string) {
    if (fromStatus === toStatus) return;

    setColumns((prev) => {
      const card = prev[fromStatus]?.find((app) => app.id === id);
      if (!card) return prev;

      return {
        ...prev,
        [fromStatus]: prev[fromStatus].filter((app) => app.id !== id),
        [toStatus]: [card, ...(prev[toStatus] ?? [])],
      };
    });

    startTransition(() => {
      updateApplicationStatus(id, toStatus);
    });
  }

  function handleDragStart(e: React.DragEvent, id: string, fromStatus: string) {
    e.dataTransfer.setData("applicationId", id);
    e.dataTransfer.setData("fromStatus", fromStatus);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(e: React.DragEvent, toStatus: string) {
    e.preventDefault();
    setDraggedOverColumn(null);
    const id = e.dataTransfer.getData("applicationId");
    const fromStatus = e.dataTransfer.getData("fromStatus");
    if (id && fromStatus) {
      moveCard(id, fromStatus, toStatus);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
      {STATUSES.map((status) => (
        <div
          key={status}
          onDragOver={(e) => {
            e.preventDefault();
            setDraggedOverColumn(status);
          }}
          onDragLeave={() =>
            setDraggedOverColumn((prev) => (prev === status ? null : prev))
          }
          onDrop={(e) => handleDrop(e, status)}
          className={`overflow-hidden rounded-lg border bg-gray-50 transition-colors ${
            draggedOverColumn === status
              ? "border-gray-900 bg-gray-100"
              : "border-gray-200"
          }`}
        >
          <div className={`h-1 ${STATUS_COLORS[status]}`} />
          <div className="p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${COLUMN_ACCENTS[status]}`} />
                <h2 className="text-sm font-semibold text-gray-900">
                  {COLUMN_LABELS[status]}
                </h2>
              </div>
              <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                {columns[status]?.length ?? 0}
              </span>
            </div>

            <div className="space-y-2">
              {(columns[status] ?? []).length === 0 ? (
                <p className="py-6 text-center text-xs text-gray-400">No applications</p>
              ) : (
                columns[status].map((app) => (
                  <KanbanCard
                    key={app.id}
                    application={app}
                    status={status}
                    onDragStart={handleDragStart}
                    onStatusChange={moveCard}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function KanbanCard({
  application,
  status,
  onDragStart,
  onStatusChange,
}: {
  application: KanbanApplication;
  status: string;
  onDragStart: (e: React.DragEvent, id: string, fromStatus: string) => void;
  onStatusChange: (id: string, fromStatus: string, toStatus: string) => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, application.id, status)}
      className="cursor-grab rounded-lg border border-gray-200 bg-white p-3 shadow-sm active:cursor-grabbing"
    >
      <Link href={`/applications/${application.id}`}>
        <p className="text-sm font-medium text-gray-900">
          {application.isFavorite && <span className="mr-1 text-yellow-500">★</span>}
          {application.company}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">{application.jobTitle}</p>
        {application.location && (
          <p className="mt-0.5 text-xs text-gray-400">{application.location}</p>
        )}
      </Link>
      <select
        value={status}
        onChange={(e) => onStatusChange(application.id, status, e.target.value)}
        className="mt-2 w-full rounded border border-gray-200 px-1.5 py-1 text-xs"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}