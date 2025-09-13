export const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl shadow p-4 border">
    <h3 className="font-semibold mb-3">{title}</h3>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);
