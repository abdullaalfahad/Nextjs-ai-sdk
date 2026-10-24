# AI Completion API with Next.js and Google Gemini

This project demonstrates a text completion API using Next.js 16+ and the Vercel AI SDK with Google Gemini.

## Features

- **API Route**: `/api/completion` - POST endpoint for text generation
- **generateText**: Non-blocking text completion using AI SDK
- **Gemini Integration**: Uses your Google Gemini API key
- **Client Component**: Example UI component for testing

## Setup

### 1. Install Dependencies

The required packages are already in `package.json`:

```bash
pnpm install
```

Key packages:
- `ai@^4.0.0` - Vercel AI SDK
- `@ai-sdk/google@^0.0.47` - Google Gemini provider
- `next@16.4.3` - Next.js framework

### 2. Configure Environment Variables

Create a `.env.local` file with your Google Gemini API key:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Or copy from `.env.example`:

```bash
cp .env.example .env.local
```

Get your API key from: https://aistudio.google.com/apikey

## API Usage

### Endpoint: POST `/api/completion`

#### Request Body

```json
{
  "prompt": "Write a haiku about programming"
}
```

Parameters:
- `prompt` (required): The text prompt to send to Gemini

#### Response

```json
{
  "text": "The generated text response...",
  "finishReason": "stop",
  "usage": {
    "promptTokens": 10,
    "completionTokens": 50
  }
}
```

### Example Usage

#### Using fetch

```typescript
const response = await fetch('/api/completion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    prompt: 'Hello, world!'
  }),
});

const data = await response.json();
console.log(data.text);
```

## File Structure

```
app/
├── api/
│   └── completion/
│       └── route.ts          # API endpoint implementation
├── components/
│   └── CompletionExample.tsx # Example client component
├── page.tsx                  # Home page with UI
└── layout.tsx
```

## Running the Project

Development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Model

Currently configured to use: `gemini-2.0-flash`

You can change this in `app/api/completion/route.ts`:

```typescript
model: google('gemini-2.0-flash')
```

### Available Google Gemini Models

- `gemini-2.0-flash` (recommended - fast, free tier available)
- `gemini-2.0-pro` (more capable)
- `gemini-1.5-pro` (high performance)
- `gemini-1.5-flash` (faster, lower cost)

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `400` - Bad request (missing prompt)
- `500` - Server error

## Next Steps

- Add authentication to the API
- Implement message history (conversation)
- Add tool/function calling
- Rate limiting
- Database storage for completions
