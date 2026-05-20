'use client';
import { useState, useRef, useEffect } from 'react';
import useStore from '../lib/store';
import { t } from '../lib/translations';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { Send, Sparkles, Mic, MicOff } from 'lucide-react';

export default function ChatPage() {
  const { language, profile, chatMessages, addChatMessage, isChatLoading, setChatLoading } = useStore();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const T = (key) => t(language, key);

  const suggestions = T('chatSuggestions') || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendMessage = async (text) => {
    if (!text.trim() || isChatLoading) return;
    const userMsg = { role: 'user', content: text, timestamp: Date.now() };
    addChatMessage(userMsg);
    setInput('');
    setChatLoading(true);

    try {
      const messages = [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, profile, language })
      });

      if (res.ok) {
        const data = await res.json();
        addChatMessage({ role: 'assistant', content: data.response, timestamp: Date.now() });
      } else {
        // Fallback response
        const fallback = language === 'hi'
          ? 'मुझे खेद है, अभी AI सेवा उपलब्ध नहीं है। कृपया बाद में प्रयास करें। आप अपने डैशबोर्ड पर जाकर अपनी योजनाएं देख सकते हैं।'
          : 'I apologize, the AI service is not available right now. Please try again later. You can visit your dashboard to see your matched schemes.';
        addChatMessage({ role: 'assistant', content: fallback, timestamp: Date.now() });
      }
    } catch {
      addChatMessage({ role: 'assistant', content: 'Sorry, I couldn\'t connect to the service. Please check your internet connection and try again.', timestamp: Date.now() });
    }
    setChatLoading(false);
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    if (isListening) { setIsListening(false); return; }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.onresult = (e) => { setInput(e.results[0][0].transcript); setIsListening(false); };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--neutral-50)' }}>
      <Header />
      <div className="flex-1 flex flex-col" style={{ paddingTop: 'var(--header-total-height)', maxWidth: 700, margin: '0 auto', width: '100%' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4" style={{ paddingBottom: 140 }}>
          {chatMessages.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, var(--primary-100), var(--accent-100))' }}>
                <Sparkles size={28} style={{ color: 'var(--primary-500)' }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--neutral-900)' }}>{T('chatTitle')}</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--neutral-500)' }}>Ask me anything about government schemes, documents, or how to apply.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {(Array.isArray(suggestions) ? suggestions : []).map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)} className="px-4 py-2 rounded-full text-sm transition-all" style={{ background: 'white', border: '1px solid var(--neutral-200)', color: 'var(--neutral-700)', cursor: 'pointer' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>
                  <Sparkles size={14} color="white" />
                </div>
              )}
              <div className={msg.role === 'user' ? 'chat-bubble chat-bubble-user' : 'chat-bubble chat-bubble-ai'}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isChatLoading && (
            <div className="flex justify-start mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>
                <Sparkles size={14} color="white" />
              </div>
              <div className="chat-bubble chat-bubble-ai">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: 'var(--neutral-400)', animationDelay: '0s' }} />
                  <div className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: 'var(--neutral-400)', animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: 'var(--neutral-400)', animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="fixed bottom-0 left-0 right-0 p-4 glass md:bottom-0" style={{ borderTop: '1px solid var(--neutral-200)' }}>
          <div className="flex gap-2" style={{ maxWidth: 700, margin: '0 auto' }}>
            <button onClick={toggleVoice} className="btn btn-ghost btn-sm flex-shrink-0" style={{ color: isListening ? 'var(--danger-500)' : 'var(--neutral-500)' }}>
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <input
              className="input flex-1"
              placeholder={T('chatPlaceholder')}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            />
            <button onClick={() => sendMessage(input)} className="btn btn-primary btn-sm flex-shrink-0" disabled={!input.trim() || isChatLoading}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
