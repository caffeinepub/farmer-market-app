import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

const FAQ_KB: Array<{ keywords: string[]; answer: string }> = [
  {
    keywords: ['soil', 'preparation', 'prepare', 'land', 'tillage'],
    answer: '🌱 Soil preparation: Till the soil 6-8 inches deep, remove weeds, add organic compost (2-3 kg per sq meter), and ensure proper drainage. Test soil pH (ideal: 6.0-7.0) before planting.',
  },
  {
    keywords: ['fertilizer', 'fertilize', 'npk', 'nutrient', 'manure'],
    answer: '🌿 Fertilizers: Use NPK (10-26-26) for root crops, urea for leafy vegetables. Apply organic manure 2-3 weeks before planting. Avoid over-fertilizing — it burns roots.',
  },
  {
    keywords: ['pest', 'insect', 'bug', 'aphid', 'caterpillar', 'control'],
    answer: '🐛 Pest control: Use neem oil spray (5ml/liter water) for aphids and mites. For caterpillars, use Bt (Bacillus thuringiensis). Introduce ladybugs as natural predators. Rotate crops annually.',
  },
  {
    keywords: ['water', 'irrigation', 'watering', 'drip', 'sprinkler'],
    answer: '💧 Irrigation: Drip irrigation saves 40-60% water. Water in the morning to reduce evaporation. Most vegetables need 1-2 inches of water per week. Avoid waterlogging.',
  },
  {
    keywords: ['season', 'crop', 'when', 'plant', 'sow', 'kharif', 'rabi'],
    answer: '📅 Crop seasons: Kharif (June-Nov): Rice, Maize, Cotton, Groundnut. Rabi (Nov-Apr): Wheat, Mustard, Peas. Zaid (Apr-Jun): Cucumber, Watermelon, Bitter gourd.',
  },
  {
    keywords: ['tomato', 'tomatoes'],
    answer: '🍅 Tomatoes: Plant in well-drained soil with full sun. Space 45-60cm apart. Water regularly, avoid wetting leaves. Stake plants when 30cm tall. Harvest in 60-80 days.',
  },
  {
    keywords: ['rice', 'paddy'],
    answer: '🌾 Rice cultivation: Requires flooded fields (5-10cm water). Transplant seedlings at 25-30 days. Apply nitrogen fertilizer in 3 splits. Harvest when 80% grains turn golden.',
  },
  {
    keywords: ['wheat'],
    answer: '🌾 Wheat: Sow in October-November. Requires 4-6 irrigations. Apply 120kg N/ha in splits. Harvest when grain moisture is 12-14%. Yield: 4-5 tonnes/ha.',
  },
  {
    keywords: ['disease', 'fungal', 'blight', 'rust', 'mildew', 'wilt'],
    answer: '🍄 Disease management: Use copper-based fungicides for fungal diseases. Ensure good air circulation. Remove infected plants immediately. Rotate crops to break disease cycles.',
  },
  {
    keywords: ['compost', 'organic', 'vermicompost', 'worm'],
    answer: '♻️ Composting: Mix green waste (kitchen scraps, grass) with brown waste (dry leaves, straw) in 1:3 ratio. Keep moist, turn weekly. Ready in 2-3 months. Vermicompost is ready in 45-60 days.',
  },
  {
    keywords: ['harvest', 'harvesting', 'yield', 'storage'],
    answer: '🌽 Harvesting tips: Harvest in the morning when temperatures are cool. Handle produce gently to avoid bruising. Store in cool, dry, ventilated areas. Most vegetables last 3-7 days at room temperature.',
  },
  {
    keywords: ['price', 'market', 'sell', 'mandi', 'profit'],
    answer: '💰 Market tips: Check local mandi prices daily. Sell directly to consumers for 20-30% higher prices. Grade and sort produce before selling. Use FarmDirect to reach customers directly!',
  },
  {
    keywords: ['onion', 'garlic'],
    answer: '🧅 Onion/Garlic: Plant in well-drained sandy loam soil. Space 10-15cm apart. Reduce watering 2 weeks before harvest. Cure bulbs in shade for 2-3 weeks before storage.',
  },
  {
    keywords: ['mango', 'fruit tree', 'orchard'],
    answer: '🥭 Mango cultivation: Plant in deep, well-drained soil. Space 10m apart. Prune after harvest. Apply potassium fertilizer before flowering. Protect from fruit fly with pheromone traps.',
  },
  {
    keywords: ['banana', 'plantain'],
    answer: '🍌 Banana: Requires warm, humid climate. Plant suckers 2m apart. Apply heavy mulch. Needs 25-50mm water/week. Harvest when fingers are plump and green-yellow. Ratoon crop for 2-3 cycles.',
  },
  {
    keywords: ['hello', 'hi', 'help', 'start', 'namaste'],
    answer: '👋 Hello! I\'m your farming assistant. Ask me about soil preparation, fertilizers, pest control, crop seasons, irrigation, harvesting, or any farming topic!',
  },
];

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const entry of FAQ_KB) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.answer;
    }
  }
  return "🤔 I'm not sure about that. Try asking about: soil preparation, fertilizers, pest control, irrigation, crop seasons, harvesting, or specific crops like tomato, rice, wheat, mango, or banana!";
}

export default function FarmingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: "👋 Hello! I'm your farming assistant. Ask me anything about farming!",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: input, isBot: false };
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: getBotResponse(input),
      isBot: true,
    };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-card border rounded-2xl shadow-card-hover overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="farm-gradient p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Bot className="h-5 w-5" />
              <div>
                <p className="font-bold text-sm">Farming Assistant</p>
                <p className="text-xs opacity-80">Ask me anything about farming</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="h-72 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.isBot
                      ? 'bg-muted text-foreground rounded-tl-sm'
                      : 'bg-primary text-primary-foreground rounded-tr-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about farming..."
              className="text-sm"
            />
            <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="h-14 w-14 rounded-full shadow-card-hover farm-gradient border-0 text-white"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}
