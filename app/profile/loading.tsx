export default function ProfileLoading() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-48 bg-gray-800 rounded"></div>
          <div className="h-10 w-24 bg-gray-800 rounded-lg"></div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-800"></div>
            <div className="flex-1">
              <div className="h-5 w-40 bg-gray-800 rounded mb-2"></div>
              <div className="h-4 w-56 bg-gray-800 rounded"></div>
            </div>
          </div>
          <div className="h-4 w-32 bg-gray-800 rounded mb-4"></div>
          <div className="h-16 bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    </main>
  );
}