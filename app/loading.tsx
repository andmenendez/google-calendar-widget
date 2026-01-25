export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading calendar...</p>
      </div>
    </div>
  );
}
