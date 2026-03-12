interface OutputPanelProps {
  output: string;
  isRunning: boolean;
  error?: boolean;
}

export default function OutputPanel({
  output,
  isRunning,
  error = false,
}: OutputPanelProps) {
  return (
    <div className="h-full bg-[#080a12] p-3 overflow-auto font-mono text-sm">
      {isRunning ? (
        <div className="flex items-center gap-2 text-yellow-400">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Running...
        </div>
      ) : output ? (
        <pre
          className={`whitespace-pre-wrap ${
            error ? "text-red-400" : "text-green-400"
          }`}
        >
          {output}
        </pre>
      ) : (
        <span className="text-gray-500">
          Click &apos;Run&apos; to execute your code
        </span>
      )}
    </div>
  );
}
