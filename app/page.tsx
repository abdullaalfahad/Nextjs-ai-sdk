import CompletionExample from './components/CompletionExample';

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-zinc-50 dark:bg-black">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-zinc-800 px-6 py-4 bg-white dark:bg-zinc-950">
        <h1 className="text-2xl font-bold text-black dark:text-white">AI Completion</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Powered by OpenRouter (Kimi K3.1 Pro - Free)
        </p>
      </div>

      {/* Main content */}
      <main className="flex-1 px-4 py-4 max-w-4xl mx-auto w-full">
        <CompletionExample />
      </main>
    </div>
  );
}
