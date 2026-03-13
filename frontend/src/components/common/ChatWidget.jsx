import { useState, useRef, useEffect } from 'react';
import { IoChatbubbleEllipses, IoClose, IoSend } from 'react-icons/io5';
import { IoLogoWhatsapp } from 'react-icons/io5';


// Replace with the company's WhatsApp number (include country code, no + or spaces)
const WHATSAPP_NUMBER = '27796161262';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Promise%20Organics%2C%20I%27d%20like%20some%20help%20with%20my%20order.`;


const API = import.meta.env.VITE_API_URL || '';


const WELCOME = {
  id: 0,
  role: 'assistant',
  content: "Hi! I'm Zoe 👋 How can I help you today?",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen]             = useState(false);
  const [messages, setMessages]         = useState([WELCOME]);
  const [input, setInput]               = useState('');
  const [isLoading, setIsLoading]       = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);

  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const buildHistory = (msgs) =>
    msgs
      .filter((m) => m.id !== 0) // exclude welcome placeholder
      .slice(-10)
      .map(({ role, content }) => ({ role, content }));

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { id: Date.now(), role: 'user', content: text };
    const next    = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setIsLoading(true);
    setShowQuickQuestions(false);

    try {
      const res  = await fetch(`${API}/api/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          message:             text,
          conversationHistory: buildHistory(next),
        }),
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't get a response. Please try again.";
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const QUICK_QUESTIONS = [
    '🚚 How long does delivery take?',
    '💳 What payment methods do you accept?',
    '🔄 What is your returns policy?',
    '🌿 Are your products 100% natural?',
    '📦 How do I track my order?',
  ];

  const sendQuickQuestion = async (text) => {
    if (isLoading) return;
    setShowQuickQuestions(false);

    const userMsg = { id: Date.now(), role: 'user', content: text };
    const next    = [...messages, userMsg];
    setMessages(next);
    setIsLoading(true);

    try {
      const res  = await fetch(`${API}/api/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          message:             text,
          conversationHistory: buildHistory(next),
        }),
      });
      const data  = await res.json();
      const reply = data.reply || "Sorry, I couldn't get a response. Please try again.";
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      {isOpen && (
        <div className="w-[320px] h-[460px] bg-white dark:bg-[#1e3d2a] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-[#2d5a3d]">

          {/* Header */}
          <div className="bg-[#7c8c7d] px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              Z
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm leading-tight">Promise Organics Support</p>
              <p className="text-white/70 text-xs">Zoe · Usually replies instantly</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 dark:bg-[#162d20]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#7c8c7d] flex items-center justify-center text-white text-[10px] font-bold mr-2 flex-shrink-0 mt-1">
                    Z
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#7c8c7d] text-white rounded-tr-sm'
                      : 'bg-white dark:bg-[#1e3d2a] text-gray-800 dark:text-[#f0f7f2] rounded-tl-sm shadow-sm border border-gray-100 dark:border-[#2d5a3d]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Quick question chips */}
            {showQuickQuestions && (
              <div className="flex flex-wrap gap-2 pl-8 pb-1">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendQuickQuestion(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#7c8c7d] text-[#7c8c7d] hover:bg-[#7c8c7d] hover:text-white transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#7c8c7d] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                  Z
                </div>
                <div className="bg-white dark:bg-[#1e3d2a] border border-gray-100 dark:border-[#2d5a3d] shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 bg-white dark:bg-[#1e3d2a] border-t border-gray-100 dark:border-[#2d5a3d] flex gap-2 items-end">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message…"
              disabled={isLoading}
              className="flex-1 resize-none border border-gray-200 dark:border-[#2d5a3d] dark:bg-[#162d20] dark:text-[#f0f7f2] dark:placeholder-[#7a9e85] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#7c8c7d] transition-colors max-h-24 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 bg-[#7c8c7d] rounded-xl flex items-center justify-center text-white hover:bg-[#6b7a6c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <IoSend size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Floating chat button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-14 h-14 bg-[#7c8c7d] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#6b7a6c] transition-all duration-200 hover:scale-110 active:scale-95"
      >
        {isOpen
          ? <IoClose size={24} />
          : <IoChatbubbleEllipses size={24} />
        }
      </button>

      {/* WhatsApp button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat with us on WhatsApp"
        className="w-14 h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#1ebe5d] transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <IoLogoWhatsapp size={28} />
      </a>
    </div>
  );
}
