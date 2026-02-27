import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { findAnswer, suggestedQuestions } from '../data/chatbotKnowledgeBase';

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'bot',
  text: "👋 Hi! I'm your AI Career Guide. I can help with resume tips, interview prep, career planning, and job search strategies. What would you like to know?",
};

export default function CareerChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text: text.trim() };
    const answer = findAnswer(text.trim());
    const botMsg: Message = { id: `b-${Date.now()}`, role: 'bot', text: answer };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage(input);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
        aria-label="Open career chatbot"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-teal-600 text-white px-4 py-3 flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <div>
              <p className="font-semibold text-sm">AI Career Guide</p>
              <p className="text-xs opacity-80">Always here to help</p>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 h-72 p-3">
            <div className="space-y-3">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${msg.role === 'bot' ? 'bg-teal-600' : 'bg-portal-600'}`}>
                    {msg.role === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div
                    className={`max-w-[75%] text-xs rounded-xl px-3 py-2 whitespace-pre-wrap leading-relaxed ${
                      msg.role === 'bot'
                        ? 'bg-muted text-foreground rounded-tl-none'
                        : 'bg-portal-600 text-white rounded-tr-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2">
              <p className="text-xs text-muted-foreground mb-1.5">Suggested questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedQuestions.slice(0, 3).map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700 rounded-full px-2.5 py-1 hover:bg-teal-100 transition-colors"
                  >
                    {q.length > 30 ? q.slice(0, 30) + '…' : q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-3 flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 h-8 text-xs"
            />
            <Button
              size="icon"
              className="h-8 w-8 bg-teal-600 hover:bg-teal-700 text-white flex-shrink-0"
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
