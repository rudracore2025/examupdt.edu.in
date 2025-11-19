export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#F5F5F5] flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#004AAD] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-[#004AAD] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-[#004AAD] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-[#0A0A0A]/60 text-sm">Loading...</p>
      </div>
    </div>
  );
}
