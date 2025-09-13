export const Toggle = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <label className="flex items-center gap-2 text-sm">
    <span className="w-36 shrink-0">{label}</span>
    <button
      className={"px-3 py-1 rounded border bg-black text-white"}
      onClick={() => onChange(!value)}
    >
      {value ? "ON" : "OFF"}
    </button>
  </label>
);
