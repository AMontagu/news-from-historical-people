# Hot Takes From History 🔥

A web app where historical figures comment on modern news headlines. Built with React, Vite, and powered by Google Gemini AI.

## Features

- Choose from 8 historical figures (Napoleon, Cleopatra, Socrates, and more)
- Browse real-time news headlines from NewsAPI
- Generate witty, in-character responses using AI
- Copy and share your favorite hot takes

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **UI**: shadcn/ui (Tailwind CSS)
- **Backend**: Vercel Serverless Functions
- **AI**: LangChain with Google Gemini
- **News**: NewsAPI.org

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- A Google AI API key (for Gemini)
- A NewsAPI.org API key

### Installation

1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your API keys:
   ```
   GOOGLE_API_KEY=your-gemini-api-key
   NEWS_API_KEY=your-newsapi-key
   ```

4. Run the development server:
   ```bash
   vercel dev
   ```

   Or for frontend-only development:
   ```bash
   npm run dev
   ```

### Deployment

Deploy to Vercel:

```bash
vercel --prod
```

Make sure to add your environment variables in the Vercel dashboard.

## Project Structure

```
├── api/
│   ├── generate.ts    # AI hot take generation
│   └── news.ts        # NewsAPI proxy
├── src/
│   ├── components/
│   │   ├── ui/        # shadcn/ui components
│   │   ├── FigureSelector.tsx
│   │   ├── NewsHeadlines.tsx
│   │   └── HotTakeDisplay.tsx
│   ├── data/
│   │   └── figures.ts # Historical figures data
│   ├── lib/
│   │   ├── api.ts     # API client functions
│   │   └── utils.ts   # Utility functions
│   ├── App.tsx
│   └── main.tsx
└── vercel.json
```

## License

MIT
