import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-status-pending/10 text-yellow-800 border-status-pending/20",
    },
    approved: {
      label: "Approved", 
      className: "bg-status-approved/10 text-green-800 border-status-approved/20",
    },
    rejected: {
      label: "Rejected",
      className: "bg-status-rejected/10 text-red-800 border-status-rejected/20",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}