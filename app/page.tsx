import Link from 'next/link';

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-zinc-50 dark:bg-black">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-zinc-800 px-6 py-4 bg-white dark:bg-zinc-950">
        <h1 className="text-2xl font-bold text-black dark:text-white">AI SDK Examples</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Powered by OpenRouter
        </p>
      </div>

      {/* Main content */}
      <main className="flex-1 px-4 py-4 max-w-2xl mx-auto w-full flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Text Generation Card */}
          <Link href="/completion" className="block">
            <div className="h-full p-6 bg-white dark:bg-zinc-900 rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all duration-200 border border-gray-200 dark:border-zinc-700">
              <h2 className="text-xl font-bold text-black dark:text-white mb-2">Text Generation</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Generate complete text responses in one go
              </p>
              <div className="text-blue-600 dark:text-blue-400 font-medium">
                Go to Text Generation &rarr;
              </div>
            </div>
          </Link>

          {/* Streaming Card */}
          <Link href="/stream" className="block">
            <div className="h-full p-6 bg-white dark:bg-zinc-900 rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all duration-200 border border-gray-200 dark:border-zinc-700">
              <h2 className="text-xl font-bold text-black dark:text-white mb-2">Streaming</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get real-time streaming responses as they're generated
              </p>
              <div className="text-blue-600 dark:text-blue-400 font-medium">
                Go to Streaming &rarr;
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
