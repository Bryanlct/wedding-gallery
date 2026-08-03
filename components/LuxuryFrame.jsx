export default function LuxuryFrame({ children, className = "", as: Tag = "section" }) {
  return (
    <Tag className={`luxury-frame ${className}`}>
      <span className="filigree-corner filigree-corner-tl" aria-hidden="true" />
      <span className="filigree-corner filigree-corner-tr" aria-hidden="true" />
      <span className="filigree-corner filigree-corner-bl" aria-hidden="true" />
      <span className="filigree-corner filigree-corner-br" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </Tag>
  );
}
