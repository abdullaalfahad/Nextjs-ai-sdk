'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';

export default function ChatExample() {
  const { messages, sendMessage, status, stop, error, setMessages } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const isBusy = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submit = () => {
    const text = input.trim();
    if (!text || isBusy) return;
    sendMessage({ text });
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden">
      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-zinc-800 space-y-4">
        {messages.length === 0 && (
          <div className="text-gray-400 dark:text-gray-500 text-center mt-8">
            Start a conversation
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl whitespace-pre-wrap break-words ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-zinc-600 rounded-bl-sm'
              }`}
            >
              {message.parts.map((part, index) =>
                part.type === 'text' ? (
                  <span key={`${message.id}-${index}`}>{part.text}</span>
                ) : null
              )}
            </div>
          </div>
        ))}

        {status === 'submitted' && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-400 dark:text-gray-400 text-sm">
              Thinking...
            </div>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 text-center">
            {error.message}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-zinc-700 p-4 bg-white dark:bg-zinc-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex flex-col gap-3"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
            className="w-full p-3 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            rows={2}
            disabled={isBusy}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isBusy || !input.trim()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isBusy ? 'Sending...' : 'Send'}
            </button>
            {isBusy ? (
              <button
                type="button"
                onClick={stop}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Stop
              </button>
            ) : (
              messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  className="px-6 py-3 bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 font-medium"
                >
                  Clear
                </button>
              )
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
