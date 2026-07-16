export default function SectionHeader({ label }: { label: string }) {
  return (
    <div className="section-header">
      <div className="section-header__accent" />
      <span className="section-header__label">{label}</span>
    </div>
  );
}
