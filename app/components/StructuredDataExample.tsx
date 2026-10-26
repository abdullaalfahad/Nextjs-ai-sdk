'use client';

import { useObject } from '@ai-sdk/react';
import { useState } from 'react';
import { recipeSchema } from '../api/structred-data/schema';

export default function StructuredDataExample() {
  const { object, submit, isLoading, stop, error, clear } = useObject({
    api: '/api/structred-data',
    schema: recipeSchema,
  });
  const [dish, setDish] = useState('');

  const handleSubmit = () => {
    const text = dish.trim();
    if (!text || isLoading) return;
    submit({ dish: text });
    setDish('');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden">
      {/* Recipe output */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-zinc-800">
        {error && (
          <div className="mb-4 text-sm text-red-600 dark:text-red-400 text-center">
            {error.message}
          </div>
        )}

        {object ? (
          <div className="space-y-6 text-gray-800 dark:text-gray-100">
            {object.name && (
              <h2 className="text-2xl font-bold text-black dark:text-white">{object.name}</h2>
            )}

            {object.ingredients && object.ingredients.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <ul className="space-y-1">
                  {object.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="flex justify-between px-3 py-2 bg-white dark:bg-zinc-700 rounded border border-gray-200 dark:border-zinc-600"
                    >
                      <span>{ingredient?.name}</span>
                      <span className="text-gray-500 dark:text-gray-300">
                        {ingredient?.amount} {ingredient?.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {object.steps && object.steps.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold mb-2">Steps</h3>
                <ol className="space-y-2">
                  {object.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium">
                        {step?.step ?? index + 1}
                      </span>
                      <p className="pt-0.5">{step?.description}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
        ) : (
          <div className="text-gray-400 dark:text-gray-500 text-center mt-8">
            {isLoading ? 'Generating recipe...' : 'Enter a dish to generate a recipe'}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-zinc-700 p-4 bg-white dark:bg-zinc-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-3"
        >
          <input
            value={dish}
            onChange={(e) => setDish(e.target.value)}
            placeholder="Enter a dish... (e.g. Chicken biryani)"
            className="w-full p-3 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !dish.trim()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Generating...' : 'Generate Recipe'}
            </button>
            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Stop
              </button>
            ) : (
              object && (
                <button
                  type="button"
                  onClick={clear}
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
