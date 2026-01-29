# Hot Takes From History

A fun web app where historical figures comment on modern news headlines from their unique perspective.

## Tech Stack
- **Frontend**: React + Vite
- **UI Components**: shadcn/ui (Tailwind CSS-based)
- **Backend**: Vercel Serverless Functions (API routes)
- **News API**: NewsAPI.org for fetching top headlines
- **LLM**: Claude API for generating funny responses
- **Deployment**: Vercel (free tier)

## Architecture

```
┌─────────────┐     ┌─────────────────────┐     ┌─────────────┐
│   Browser   │────▶│  Vercel Serverless  │────▶│  Claude API │
│  (React)    │◀────│  /api/generate      │◀────│             │
└─────────────┘     └─────────────────────┘     └─────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │     NewsAPI.org     │
                    └─────────────────────┘
```

- Frontend calls `/api/generate` (your serverless function)
- Serverless function holds API keys securely
- Keys never exposed to browser

## Environment Variables

### Local Development (`.env.local`)
```
ANTHROPIC_API_KEY=sk-ant-...
NEWS_API_KEY=your-newsapi-key
```

### Vercel Dashboard
Set the same variables in: Project Settings → Environment Variables

**Important**: Add `.env.local` to `.gitignore`

## News API Integration

### Recommended API
[NewsAPI.org](https://newsapi.org/) - Simple REST API with free tier
- **Endpoint**: `https://newsapi.org/v2/top-headlines`
- **Free tier**: 100 requests/day, developer use
- **Returns**: JSON with articles (title, description, source, url)

### Alternative Options
- [NewsData.io](https://newsdata.io/) - More sources, 89 languages
- [GNews API](https://gnews.io/) - 80,000+ sources

## Implementation Steps

### Step 1: Project Setup
- [ ] Create Vite + React + TypeScript project
- [ ] Configure TypeScript settings
- [ ] Set up project structure
- [ ] Create `.env.local` with API keys
- [ ] Add `.env.local` to `.gitignore`

### Step 2: Install and Configure shadcn/ui
- [ ] Install Tailwind CSS
- [ ] Initialize shadcn/ui with `npx shadcn@latest init`
- [ ] Add required components

### Step 3: Create Vercel Serverless Functions
- [ ] Create `/api/generate.ts` for Claude API calls
- [ ] Create `/api/news.ts` for NewsAPI calls (optional, can call from frontend)
- [ ] Test locally with `vercel dev`

### Step 4: Set Up NewsAPI Integration
- [ ] Create API service for fetching headlines
- [ ] Implement category filtering

### Step 5: Build UI Components
- [ ] Historical figure selector (grid of clickable cards)
- [ ] News headlines list with selection
- [ ] Hot take display area (styled quote/speech bubble)
- [ ] Loading states with skeletons

### Step 6: Integrate Claude API
- [ ] Create prompt template with figure personality
- [ ] Call `/api/generate` from frontend
- [ ] Display response with typing effect (optional)

### Step 7: Polish and Responsive Design
- [ ] Add fun animations (entrance, hover effects)
- [ ] Mobile responsive
- [ ] Share button (copy to clipboard)

## shadcn Components to Use
- `Card` - for historical figure selection
- `Button` - for actions
- `Select` - for news category selection
- `Skeleton` - for loading states
- `Avatar` - for historical figures
- `ScrollArea` - for news headlines list

## Historical Figures Data
Include 6-8 figures with:
- Name
- Era/title
- Avatar (can use placeholder or emoji initially)
- Personality traits for the prompt

**Suggested figures:**
1. Napoleon Bonaparte - ambitious, ego-driven
2. Cleopatra - dramatic, regal
3. Socrates - questioning everything
4. Julius Caesar - betrayal-obsessed
5. Marie Antoinette - out of touch
6. Leonardo da Vinci - inventor mindset
7. Genghis Khan - conquest-focused
8. Shakespeare - dramatic, poetic

## API Prompt Template (Draft)

```
You are {figure_name}, the famous {title} from {era}.
You have just been told about this modern news headline: "{headline}"

React to this news as if you were really {figure_name}. Be:
- Anachronistic (interpret through your historical lens)
- Funny and witty
- In character (use speech patterns fitting your era)
- Brief (2-3 sentences max)

Your hot take:
```

## File Structure
```
/
├── api/
│   └── generate.ts        # Vercel serverless function for Claude
├── src/
│   ├── components/
│   │   ├── ui/            # shadcn components
│   │   ├── FigureSelector.tsx
│   │   ├── NewsHeadlines.tsx
│   │   └── HotTakeDisplay.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.local             # Local env vars (git-ignored)
├── .gitignore
├── components.json        # shadcn config
├── tailwind.config.js
├── package.json
├── vite.config.ts
├── vercel.json            # Vercel config (optional)
└── claude.md
```

## Demo Flow
1. User sees grid of historical figures
2. User clicks on one (e.g., Napoleon)
3. User sees news headlines fetched from NewsAPI
4. User clicks a headline to select it
5. Clicks "Get Hot Take"
6. Loading animation plays
7. Napoleon's sassy response appears in a speech bubble
8. User can share or try another figure

## Deployment

### First Time Setup
1. Create account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` in project root and follow prompts
4. Add environment variables in Vercel dashboard

### Deploying Updates
- **Auto**: Push to GitHub → Vercel auto-deploys
- **Manual**: Run `vercel --prod`

### Local Development with Serverless
```bash
vercel dev
```
This runs both Vite and serverless functions locally.

## Verification
After implementation:
1. Run `vercel dev` to start local development
2. Verify shadcn components render correctly
3. Test news API integration fetches headlines
4. Test `/api/generate` returns Claude responses
5. Deploy with `vercel --prod` and test live URL
