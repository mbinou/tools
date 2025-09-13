export const Color = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <label className="flex items-center gap-2 text-sm">
    <span className="w-36 shrink-0">{label}</span>
    <input
      type="color"
      className="w-10 h-8"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <input
      type="text"
      className="border rounded px-2 py-1 w-28"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);
