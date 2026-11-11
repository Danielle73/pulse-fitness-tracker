import StatCard from "../components/dashboard/StatCard";
import TrendChart from "../components/dashboard/TrendChart";

type OverviewProps = {
  steps: string;
  minutes: number;
  calories: number;
  activeDays: number;
  activeDaysMessage: string;
  range: string;
  goal: string;
  values: number[];
};

function Overview({
  steps,
  minutes,
  calories,
  activeDays,
  activeDaysMessage,
  range,
  goal,
  values,
}: OverviewProps) {
  return (
    <>
    <section className="kpis" aria-label="Fitness summary">
      <StatCard
        title="Steps walked"
        icon="♧"
        value={steps}
        percentage={12.4}
      />
      <StatCard
        title="Exercise minutes"
        icon="◷"
        value={minutes.toLocaleString()}
        percentage={8.2}
      />
      <StatCard
        title="Calories burned"
        icon="♨"
        value={calories.toLocaleString()}
        percentage={5.7}
      />

      <StatCard
        title="Active days"
        icon="✓"
        value={
          <>
            {activeDays}
            <small>/ 7</small>
          </>
        }
        message={activeDaysMessage}
      />
    </section>

    <div className="grid">
          <section className="card panel">
            <div className="panel-head">
              <div>
                <h2>Steps walked</h2>
                <p className="subtle">
                  Your daily movement · {range.toLowerCase()}
                </p>
              </div>
              <div className="legend">
                <span>Steps</span>
                <span>Goal</span>
              </div>
            </div>
            <div className="chart-wrap">
              <TrendChart values={values} />
            </div>
            <div className="goal">
              <div className="goal-row">
                <span>Goal progress</span>
                <span>{goal}</span>
              </div>
              <div className="goal-bar">
                <span
                  style={{
                    width: `${Math.min(100, values.reduce((sum, value) => sum + value, 0) / 8)}%`,
                  }}
                />
              </div>
            </div>
          </section>
          <section className="card panel">
            <div className="panel-head">
              <div>
                <h2>Exercise breakdown</h2>
                <p className="subtle">Minutes by activity type</p>
              </div>
            </div>
            <div className="donut-area">
              <svg
                className="donut"
                viewBox="0 0 160 160"
                aria-label="Exercise breakdown"
              >
                <circle cx="80" cy="80" r="53" stroke="#edf3f3" />
                <circle
                  cx="80"
                  cy="80"
                  r="53"
                  stroke="#18a999"
                  strokeDasharray="120 333"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="53"
                  stroke="#ff9f43"
                  strokeDasharray="88 333"
                  strokeDashoffset="-120"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="53"
                  stroke="#7c6cf2"
                  strokeDasharray="68 333"
                  strokeDashoffset="-208"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="53"
                  stroke="#4b9cf5"
                  strokeDasharray="57 333"
                  strokeDashoffset="-276"
                />
                <text className="donut-total" x="80" y="78">
                  {minutes}
                </text>
                <text className="donut-label" x="80" y="96">
                  minutes
                </text>
              </svg>
              <div className="activity-list">
                {[
                  ["Walking", "104", "36%", "teal"],
                  ["Running", "76", "27%", "orange"],
                  ["Cycling", "58", "20%", "purple"],
                  ["Strength", "47", "17%", "blue"],
                ].map(([name, minutes, percent, color]) => (
                  <div className="activity" key={name}>
                    <i className={color} />
                    <span>{name}</span>
                    <small>{minutes} min</small>
                    <b>{percent}</b>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
  </>
  );
}

export default Overview;
