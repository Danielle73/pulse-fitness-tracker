import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  icon: string;
  value: ReactNode;
  percentage?: number;
  message?: string;
};


function StatCard({ title, icon, value, percentage, message }: StatCardProps) {
  const arrow =
    percentage !== undefined
      ? percentage > 0
        ? "↑"
        : percentage < 0
          ? "↓"
          : ""
      : "";

  return (
    <article className="card kpi">
      <div className="kpi-head">
        {title}
        <div className="kpi-icon">{icon}</div>
      </div>

      <div className="kpi-value">{value}</div>

      <div className="kpi-meta">
        {percentage !== undefined ? (
          <>
            <span
              className={
                percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral"
              }
            >
              {arrow} {Math.abs(percentage)}%
            </span>{" "}
            vs last period
          </>
        ) : message ? (
          <span className="up">{message}</span>
        ) : null}
      </div>
    </article>
  );
}

export default StatCard;
