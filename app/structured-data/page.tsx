import StructuredDataExample from '../components/StructuredDataExample';

export default function StructuredDataPage() {
  return (
    <div className="h-screen flex flex-col bg-zinc-50 dark:bg-black">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-zinc-800 px-6 py-4 bg-white dark:bg-zinc-950">
        <h1 className="text-2xl font-bold text-black dark:text-white">Structured Data</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Stream a typed recipe object powered by OpenRouter
        </p>
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-0 px-4 py-4 max-w-4xl mx-auto w-full">
        <StructuredDataExample />
      </main>
    </div>
  );
}
