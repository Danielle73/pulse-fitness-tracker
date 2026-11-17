import { useState } from "react";

type StepTrackerProps = {
  onSaveSteps: (date: string, steps: number) => void;
};

function StepTracker({ onSaveSteps }: StepTrackerProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [steps, setSteps] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const stepCount = Number(steps);

    if (!Number.isInteger(stepCount) || stepCount < 0) {
      return;
    }

    onSaveSteps(date, stepCount);

    setSteps("");
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

        <button className="primary-button" type="submit">
          Save steps
        </button>
      </form>
    </section>
  );
}

export default StepTracker;
