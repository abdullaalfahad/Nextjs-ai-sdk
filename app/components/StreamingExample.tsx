'use client';

import { useCompletion } from '@ai-sdk/react';

export default function StreamingExample() {
  const { completion, input, handleInputChange, handleSubmit, isLoading, stop } =
    useCompletion({
      api: '/api/completion/stream',
    });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden">
      {/* Response at top */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-zinc-800">
        {completion ? (
          <div className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap break-words">
            {completion}
          </div>
        ) : (
          <div className="text-gray-400 dark:text-gray-500 text-center mt-8">
            {isLoading ? 'Streaming response...' : 'Send a prompt to get started'}
          </div>
        )}
      </div>

      {/* Input at bottom */}
      <div className="border-t border-gray-200 dark:border-zinc-700 p-4 bg-white dark:bg-zinc-900">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Enter your prompt... (Ctrl+Enter to send)"
            className="w-full p-3 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            rows={3}
            disabled={isLoading}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && e.ctrlKey && !isLoading) {
                e.preventDefault();
                const form = e.currentTarget.form;
                if (form) {
                  const event = new Event('submit', { bubbles: true, cancelable: true });
                  form.dispatchEvent(event);
                }
              }
            }}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Streaming...' : 'Send'}
            </button>
            {isLoading && (
              <button
                type="button"
                onClick={stop}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Stop
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
