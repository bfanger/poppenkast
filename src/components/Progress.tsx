type Props = {
  /** Range: 0 - 100 */
  value: number;
};

export default function Progress({ value }: Props) {
  return (
    <div className="h-6.5 w-full rounded-full border border-cyan-500 bg-linear-to-b from-cyan-950 to-cyan-900 p-1">
      <div
        className="relative h-full"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      >
        <div className="absolute top-0 left-0 w-full animate-[glow_3s_infinite]">
          <div className="absolute top-1 left-1/2 h-3 w-8 -translate-x-1/2 rounded-full bg-cyan-300 blur-lg"></div>
        </div>
        <div className="relative size-full overflow-clip rounded-full bg-linear-to-b from-cyan-500 to-cyan-700">
          <div className="h-full animate-[shimmer_3s_infinite]">
            <div className="absolute inset-0 left-1/2 h-full w-10 -translate-x-1/2 bg-linear-to-r from-transparent via-cyan-100/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
