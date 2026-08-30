export function FormSuccess({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div
      role="status"
      className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
    >
      {message}
    </div>
  );
}
