export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
        <p className="text-zinc-500 text-sm animate-pulse">Loading dashboard metrics...</p>
      </div>
    </div>
  );
}
