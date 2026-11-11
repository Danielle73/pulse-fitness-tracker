import type { Section } from "../../types/navigation";

type SidebarProps = {
  section: Section;
  setSection: (section: Section) => void;
};

function Sidebar({ section, setSection }: SidebarProps) {
  return (
    <aside>
      <div className="brand">
        <div className="brand-mark">✦</div>
        <span>pulse</span>
      </div>
      <nav aria-label="Primary navigation">
        {(["Overview", "Activity", "Wellness", "Settings"] as Section[]).map(
          (item) => (
            <button
              className={section === item ? "active" : ""}
              key={item}
              onClick={() => setSection(item)}
              aria-current={section === item ? "page" : undefined}
            >
              <span className="nav-icon">
                {item === "Overview"
                  ? "⌂"
                  : item === "Activity"
                    ? "◷"
                    : item === "Wellness"
                      ? "♡"
                      : "⚙"}
              </span>
              <span>{item}</span>
            </button>
          ),
        )}
      </nav>
      <div className="side-note">
        <p>Keep moving!</p>
        <small>You're 1,840 steps away from your daily goal.</small>
      </div>
    </aside>
  );
}

export default Sidebar;
