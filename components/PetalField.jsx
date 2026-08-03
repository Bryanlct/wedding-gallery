export default function PetalField({ count = 12 }) {
  return (
    <div className="petal-layer" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className="petal"
          style={{
            left: `${(index * 37 + 11) % 100}%`,
            "--duration": `${8 + (index % 5) * 1.7}s`,
            "--delay": `${-index * 1.15}s`,
            "--drift": `${(index % 2 ? 1 : -1) * (30 + index * 3)}px`,
          }}
        />
      ))}
    </div>
  );
}
