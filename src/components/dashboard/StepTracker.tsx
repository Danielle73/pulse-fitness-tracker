import { useState } from "react";
import type { StepEntry } from "../../types/steps";

type StepTrackerProps = {
  stepEntries: StepEntry[];
  onSaveSteps: (date: string, steps: number) => void;
  onDeleteSteps: (date: string) => void;
};

function StepTracker({
  stepEntries,
  onSaveSteps,
  onDeleteSteps,
}: StepTrackerProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [steps, setSteps] = useState("");

  const [editingDate, setEditingDate] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const stepCount = Number(steps);

    if (!Number.isInteger(stepCount) || stepCount < 0) {
      return;
    }

    onSaveSteps(date, stepCount);

    setSteps("");
    setEditingDate(null);
  }

  function handleEdit(entry: StepEntry) {
    setDate(entry.date);
    setSteps(String(entry.steps));
    setEditingDate(entry.date);
  }

  return (
    <section className="card panel">
      <div className="panel-head">
        <div>
          <h2>Daily steps</h2>
          <p className="subtle">Track your daily movement</p>
        </div>
      </div>
      <form className="activity-form" onSubmit={handleSubmit}>
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </label>

        <label>
          Steps
          <input
            type="number"
            min="0"
            step="1"
            value={steps}
            onChange={(event) => setSteps(event.target.value)}
            placeholder="e.g. 8500"
            required
          />
        </label>

        {/* <button className="primary-button" type="submit">
          Save steps
        </button> */}

        <button className="primary-button" type="submit">
          {editingDate ? "Update steps" : "Save steps"}
        </button>

        {editingDate && (
          <button
            type="button"
            onClick={() => {
              setEditingDate(null);
              setSteps("");
              setDate(new Date().toISOString().split("T")[0]);
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <div className="step-entries">
        <h3>Daily entries</h3>

        {stepEntries.length === 0 ? (
          <p className="subtle">
            No step entries yet. Add your first one above!
          </p>
        ) : (
          <ul>
            {[...stepEntries]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((entry) => (
                <li key={entry.date}>
                  <span>
                    {new Date(`${entry.date}T00:00:00`).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </span>

                  <strong>{entry.steps.toLocaleString("en-GB")} steps</strong>

                  <button type="button" onClick={() => handleEdit(entry)}>
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteSteps(entry.date)}
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default StepTracker;
