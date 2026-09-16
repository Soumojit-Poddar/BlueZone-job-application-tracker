const STATUS_COLORS: Record<string, string> = {
  SAVED: "bg-gray-400",
  APPLIED: "bg-blue-500",
  ASSESSMENT: "bg-yellow-500",
  INTERVIEW: "bg-purple-500",
  OFFER: "bg-green-500",
  REJECTED: "bg-red-500",
  WITHDRAWN: "bg-gray-300",
};

export function StatusOverviewBar({
  counts,
  total,
}: {
  counts: Record<string, number>;
  total: number;
}) {
  const statuses = Object.keys(STATUS_COLORS);

  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
        {statuses.map((status) => {
          const count = counts[status] ?? 0;
          if (count === 0) return null;
          const widthPercent = total > 0 ? (count / total) * 100 : 0;
          return (
            <div
              key={status}
              className={STATUS_COLORS[status]}
              style={{ width: `${widthPercent}%` }}
              title={`${status}: ${count}`}
            />
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {statuses.map((status) => {
          const count = counts[status] ?? 0;
          if (count === 0) return null;
          return (
            <div key={status} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className={`h-2 w-2 rounded-full ${STATUS_COLORS[status]}`} />
              {status} ({count})
            </div>
          );
        })}
      </div>
    </div>
  );
}