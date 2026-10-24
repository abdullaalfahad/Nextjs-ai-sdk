'use client';

import { useState, useRef, useEffect } from 'react';

export default function CompletionExample() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = 0;
    }
  }, [output]);

  const handleGenerateText = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    const currentPrompt = prompt;
    setPrompt('');

    try {
      const response = await fetch('/api/completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt }),
      });

      const data = await response.json();
      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput(data.text || '');
      }
    } catch (error) {
      console.error('Error:', error);
      setOutput('Error generating text');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && !loading) {
      e.preventDefault();
      handleGenerateText();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden">
      {/* Response at top */}
      <div
        ref={outputRef}
        className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-zinc-800"
      >
        {output ? (
          <div className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap break-words">
            {output}
          </div>
        ) : (
          <div className="text-gray-400 dark:text-gray-500 text-center mt-8">
            {loading ? 'Generating response...' : 'Send a prompt to get started'}
          </div>
        )}
      </div>

      {/* Input at bottom */}
      <div className="border-t border-gray-200 dark:border-zinc-700 p-4 bg-white dark:bg-zinc-900">
        <div className="flex flex-col gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your prompt... (Ctrl+Enter to send)"
            className="w-full p-3 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            rows={3}
            disabled={loading}
          />
          <button
            onClick={handleGenerateText}
            disabled={loading || !prompt.trim()}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Generating...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
