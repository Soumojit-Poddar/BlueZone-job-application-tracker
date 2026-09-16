// const STATUS_COLORS: Record<string, string> = {
//   SAVED: "bg-gray-400",
//   APPLIED: "bg-blue-500",
//   ASSESSMENT: "bg-yellow-500",
//   INTERVIEW: "bg-purple-500",
//   OFFER: "bg-green-500",
//   REJECTED: "bg-red-500",
//   WITHDRAWN: "bg-gray-300",
// };
const STATUS_COLORS: Record<string, string> = {
  SAVED: "bg-[#F517AF]",
  APPLIED: "bg-[#2F52E0]",
  ASSESSMENT: "bg-[#F1A208]",
  INTERVIEW: "bg-[#FA5B1C]",
  OFFER: "bg-[#00FF88]",
  REJECTED: "bg-[#EE0B2D]",
  WITHDRAWN: "bg-[#B7A692]",
};

const STATUS_LABELS: Record<string, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  ASSESSMENT: "Assessment",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export function StatusOverviewBar({
  counts,
  total,
}: {
  counts: Record<string, number>;
  total: number;
}) {
  const statuses = Object.keys(STATUS_COLORS);

  if (total === 0) {
    return <p className="text-sm text-gray-500">No applications yet.</p>;
  }

  const maxCount = Math.max(1, ...statuses.map((status) => counts[status] ?? 0));

  return (
    <div className="flex h-48 items-end gap-3 border-b border-gray-200 pb-0 sm:gap-5">
      {statuses.map((status) => {
        const count = counts[status] ?? 0;
        const heightPercent = (count / maxCount) * 100;

        return (
          <div key={status} className="flex flex-1 flex-col items-center">
            <span className="mb-1.5 text-xs font-semibold text-gray-700">
              {count}
            </span>
            <div className="flex h-36 w-full items-end">
              <div
                className={`w-full rounded-t-lg ${STATUS_COLORS[status]} transition-all duration-500 ease-out hover:opacity-80`}
                style={{ height: count > 0 ? `${heightPercent}%` : "2px" }}
                title={`${STATUS_LABELS[status]}: ${count}`}
              />
            </div>
            <span className="mt-2 text-center text-[11px] leading-tight text-gray-500 sm:text-xs">
              {STATUS_LABELS[status]}
            </span>
          </div>
        );
      })}
    </div>
  );
}