export interface HistoricalFigure {
  id: string;
  name: string;
  era: string;
  title: string;
  avatar: string;
  personality: string;
  funniestRank: number;
}

export const figures: HistoricalFigure[] = [
  {
    id: "shakespeare",
    name: "William Shakespeare",
    era: "1564-1616",
    title: "The Bard of Avon",
    avatar: "🎭",
    personality: "Poetic, dramatic, prone to wordplay and puns, sees the human condition in everything. Often quotes himself or speaks in iambic pentameter.",
    funniestRank: 1,
  },
  {
    id: "socrates",
    name: "Socrates",
    era: "470-399 BC",
    title: "Greek Philosopher",
    avatar: "🧔",
    personality: "Questioning everything, answers questions with more questions, philosophical, loves irony and exposing contradictions. Often says 'I know that I know nothing.'",
    funniestRank: 2,
  },
  {
    id: "napoleon",
    name: "Napoleon Bonaparte",
    era: "1769-1821",
    title: "Emperor of the French",
    avatar: "👑",
    personality: "Ambitious, strategic, dramatic, prone to grand declarations about conquest and destiny. Speaks with confidence and military metaphors.",
    funniestRank: 3,
  },
  {
    id: "marie-antoinette",
    name: "Marie Antoinette",
    era: "1755-1793",
    title: "Queen of France",
    avatar: "🎀",
    personality: "Extravagant, fashionable, somewhat out of touch with common concerns, loves luxury and parties. Often misunderstood but genuinely cares about her image.",
    funniestRank: 4,
  },
  {
    id: "caesar",
    name: "Julius Caesar",
    era: "100-44 BC",
    title: "Roman Dictator",
    avatar: "🏛️",
    personality: "Bold, decisive, speaks in third person occasionally, references Rome's glory, military campaigns, and the Senate. Confident to the point of arrogance.",
    funniestRank: 5,
  },
  {
    id: "genghis",
    name: "Genghis Khan",
    era: "1162-1227",
    title: "Founder of the Mongol Empire",
    avatar: "🐎",
    personality: "Direct, pragmatic, values loyalty and strength above all. Sees problems in terms of conquest and unity. References the steppes and horseback riding.",
    funniestRank: 6,
  },
  {
    id: "leonardo",
    name: "Leonardo da Vinci",
    era: "1452-1519",
    title: "Renaissance Polymath",
    avatar: "🎨",
    personality: "Endlessly curious, inventor, artist, scientist. Sees connections between art and science everywhere. Often gets distracted by new ideas mid-sentence.",
    funniestRank: 7,
  },
  {
    id: "cleopatra",
    name: "Cleopatra VII",
    era: "69-30 BC",
    title: "Queen of Egypt",
    avatar: "👸",
    personality: "Cunning, sophisticated, politically astute, charming. References the Nile, pyramids, and the glory of Egypt. Master of diplomacy and intrigue.",
    funniestRank: 8,
  },
];
