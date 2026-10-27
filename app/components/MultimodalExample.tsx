'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useMemo, useRef, useState } from 'react';

const ACCEPT = 'image/*,application/pdf';
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per file

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MultimodalExample() {
  const { messages, sendMessage, status, stop, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/multimodal' }),
  });
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isBusy = status === 'submitted' || status === 'streaming';

  // Object URLs for previewing pending images; revoked when files change.
  const previews = useMemo(
    () =>
      files.map((file) => ({
        file,
        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      })),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const accepted: File[] = [];
    const rejected: string[] = [];

    Array.from(incoming).forEach((file) => {
      const isAllowed =
        file.type.startsWith('image/') || file.type === 'application/pdf';
      if (!isAllowed) {
        rejected.push(`${file.name} (unsupported type)`);
      } else if (file.size > MAX_FILE_BYTES) {
        rejected.push(`${file.name} (over 10 MB)`);
      } else {
        accepted.push(file);
      }
    });

    setFiles((prev) => [...prev, ...accepted]);
    setFileError(rejected.length ? `Skipped: ${rejected.join(', ')}` : null);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = () => {
    const text = input.trim();
    if ((!text && files.length === 0) || isBusy) return;

    // useChat accepts a FileList; it reads each file into a data URL.
    let fileList: FileList | undefined;
    if (files.length) {
      const dt = new DataTransfer();
      files.forEach((file) => dt.items.add(file));
      fileList = dt.files;
    }

    sendMessage({
      text: text || 'Describe the attached file(s).',
      files: fileList,
    });

    setInput('');
    setFiles([]);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden">
      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-zinc-800 space-y-4">
        {messages.length === 0 && (
          <div className="text-gray-400 dark:text-gray-500 text-center mt-8">
            Attach an image or PDF and ask a question about it
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
              {/* Attachments first, then text */}
              {message.parts.some((p) => p.type === 'file') && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {message.parts.map((part, index) => {
                    if (part.type !== 'file') return null;
                    const key = `${message.id}-file-${index}`;
                    if (part.mediaType.startsWith('image/')) {
                      return (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={key}
                          src={part.url}
                          alt={part.filename ?? 'Attached image'}
                          className="max-h-48 rounded-lg object-contain bg-black/10"
                        />
                      );
                    }
                    return (
                      <a
                        key={key}
                        href={part.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/15 text-sm underline-offset-2 hover:underline"
                      >
                        <span aria-hidden>📄</span>
                        {part.filename ?? 'document.pdf'}
                      </a>
                    );
                  })}
                </div>
              )}
              {message.parts.map((part, index) =>
                part.type === 'text' ? (
                  <span key={`${message.id}-text-${index}`}>{part.text}</span>
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
          {/* Pending attachments */}
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {previews.map(({ file, url }, index) => (
                <div
                  key={`${file.name}-${file.lastModified}-${index}`}
                  className="relative flex items-center gap-2 pr-8 pl-2 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-gray-800 dark:text-gray-100"
                >
                  {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={file.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <span
                      className="h-10 w-10 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-semibold"
                      aria-hidden
                    >
                      PDF
                    </span>
                  )}
                  <div className="flex flex-col min-w-0 max-w-[12rem]">
                    <span className="truncate">{file.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatBytes(file.size)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    aria-label={`Remove ${file.name}`}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-700 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {fileError && (
            <div className="text-sm text-amber-600 dark:text-amber-400">{fileError}</div>
          )}

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your files... (Enter to send, Shift+Enter for newline)"
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
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT}
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
              className="px-4 py-3 border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Attach
            </button>
            <button
              type="submit"
              disabled={isBusy || (!input.trim() && files.length === 0)}
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
