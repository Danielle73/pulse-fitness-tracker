import type { Range } from "../../types/dashboard";

type AppHeaderProps = {
  section: string;
  range: Range;
  onRangeChange: (range: Range) => void;
};

function AppHeader({
  section,
  range,
  onRangeChange,
}: AppHeaderProps) {
  return (
    <header>
      <div>
        <p className="eyebrow">{section} · Tuesday, June 18, 2024</p>
        <h1>
          Good morning, Alex <span aria-hidden="true">👋</span>
        </h1>
      </div>

      <div className="header-actions">
        <label className="date-picker">
          Range{" "}
          <select
            value={range}
            onChange={(event) =>
              onRangeChange(event.target.value as Range)
            }
          >
            {["This week", "This month", "This year"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <div className="avatar">AS</div>
      </div>
    </header>
  );
}

export default AppHeader;