"use client";

export default function GameStage({ current, total, combo = 0, children }) {
  return (
    <div className="mb-4">
      <div className="stage-row">
        <p className="stage-label">
          階段 {current} / {total}
        </p>
        {combo > 1 && <p className="combo-chip">連擊 x{combo}</p>}
      </div>
      <div className="stage-dots" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className={index < current ? "on" : ""} />
        ))}
      </div>
      {children}
    </div>
  );
}
