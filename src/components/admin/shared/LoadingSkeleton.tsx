export function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-16 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
            <div className="bg-gray-200 h-12 w-12 rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-8 w-20 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 w-24 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 space-y-4">
        <div className="bg-gray-200 h-10 rounded"></div>
        <div className="bg-gray-200 h-10 rounded"></div>
        <div className="bg-gray-200 h-32 rounded"></div>
      </div>
    </div>
  );
}
