'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import useStore from '../lib/store';
import { t } from '../lib/translations';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { Send, Sparkles, Mic, MicOff, UserCircle, ArrowRight } from 'lucide-react';

export default function ChatPage() {
  const { language, profile, chatMessages, addChatMessage, isChatLoading, setChatLoading } = useStore();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const T = (key) => t(language, key);

  const suggestions = T('chatSuggestions') || [];

  // Check if profile is meaningfully filled
  const hasProfile = profile && (profile.age || profile.state || profile.occupation || profile.gender);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, streamingText]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isChatLoading) return;
    const userMsg = { role: 'user', content: text, timestamp: Date.now() };
    addChatMessage(userMsg);
    setInput('');
    setChatLoading(true);
    setStreamingText('');

    try {
      const messages = [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, profile, language })
      });

      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('text/event-stream')) {
        // Handle streaming response
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullText += parsed.text;
                  setStreamingText(fullText);
                }
              } catch {
                // Skip unparseable
              }
            }
          }
        }

        if (fullText) {
          addChatMessage({ role: 'assistant', content: fullText, timestamp: Date.now() });
        }
        setStreamingText('');

      } else if (res.ok) {
        // Handle JSON fallback response
        const data = await res.json();
        addChatMessage({ role: 'assistant', content: data.message, timestamp: Date.now() });
      } else {
        // Error response
        const fallback = language === 'hi'
          ? 'मुझे खेद है, अभी AI सेवा उपलब्ध नहीं है। कृपया बाद में प्रयास करें। आप अपने डैशबोर्ड पर जाकर अपनी योजनाएं देख सकते हैं।'
          : 'I apologize, the AI service is not available right now. Please try again later. You can visit your dashboard to see your matched schemes.';
        addChatMessage({ role: 'assistant', content: fallback, timestamp: Date.now() });
      }
    } catch {
      addChatMessage({
        role: 'assistant',
        content: language === 'hi'
          ? 'क्षमा करें, सेवा से कनेक्ट नहीं हो पा रहा। कृपया इंटरनेट कनेक्शन जांचें।'
          : 'Sorry, I couldn\'t connect to the service. Please check your internet connection and try again.',
        timestamp: Date.now()
      });
    }
    setChatLoading(false);
  }, [chatMessages, profile, language, isChatLoading, addChatMessage, setChatLoading]);

  const toggleVoice = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert(language === 'hi' ? 'आपका ब्राउज़र वॉइस इनपुट सपोर्ट नहीं करता' : 'Your browser does not support voice input');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      if (e.results[0].isFinal) {
        setIsListening(false);
      }
    };
    recognition.onerror = (e) => {
      console.warn('Speech recognition error:', e.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  }, [isListening, language]);

  // Profile-not-set CTA
  if (!hasProfile) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'transparent', position: 'relative' }}>
        <div className="relative z-10 flex-1 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center" style={{ paddingTop: 'var(--header-height)' }}>
          <div className="text-center px-6 py-12 animate-fade-in" style={{ maxWidth: 400 }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6" style={{ background: 'linear-gradient(135deg, var(--primary-100), var(--accent-100))' }}>
              <UserCircle size={40} style={{ color: 'var(--primary-500)' }} />
            </div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--neutral-900)' }}>
              {language === 'hi' ? 'पहले अपनी प्रोफाइल बनाएं' : 'Setup Your Profile First'}
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--neutral-500)', lineHeight: 1.7 }}>
              {language === 'hi'
                ? 'AI सहायक आपकी प्रोफाइल के आधार पर बेहतर सुझाव दे सकता है। कृपया पहले अपनी जानकारी भरें।'
                : 'The AI assistant can give you personalized scheme recommendations based on your profile. Please complete the onboarding first.'}
            </p>
            <Link href="/onboarding" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              {language === 'hi' ? 'प्रोफाइल बनाएं' : 'Complete Profile'}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'transparent', position: 'relative' }}>
      <div className="relative z-10 flex-1 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col" style={{ paddingTop: 'var(--header-height)', maxWidth: 700, margin: '0 auto', width: '100%' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingBottom: 160 }}>
          {chatMessages.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, var(--primary-100), var(--accent-100))' }}>
                <Sparkles size={28} style={{ color: 'var(--primary-500)' }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--neutral-900)' }}>{T('chatTitle')}</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--neutral-500)' }}>
                {language === 'hi'
                  ? 'किसी भी सरकारी योजना, दस्तावेज़, या आवेदन प्रक्रिया के बारे में पूछें।'
                  : 'Ask me anything about government schemes, documents, or how to apply.'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {(Array.isArray(suggestions) ? suggestions : []).map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)} className="px-4 py-2 rounded-full text-sm transition-all glass" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 9999, color: 'rgba(255,255,255,0.82)', cursor: 'pointer' }}>
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

          {/* Streaming text display */}
          {streamingText && (
            <div className="flex justify-start mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>
                <Sparkles size={14} color="white" />
              </div>
              <div className="chat-bubble chat-bubble-ai">
                <p className="text-sm whitespace-pre-wrap">{streamingText}</p>
              </div>
            </div>
          )}

          {/* Loading dots (only when not streaming) */}
          {isChatLoading && !streamingText && (
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

        {/* Input area — positioned above bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-30 glass" style={{ borderTop: '1px solid var(--neutral-200)', paddingBottom: 'calc(60px + env(safe-area-inset-bottom))' }}>
          <div className="flex gap-2 p-4" style={{ maxWidth: 700, margin: '0 auto' }}>
            <button onClick={toggleVoice} className="btn btn-ghost btn-sm flex-shrink-0" style={{ color: isListening ? 'var(--danger-500)' : 'var(--neutral-500)', position: 'relative' }}>
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              {isListening && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse-soft" style={{ background: 'var(--danger-500)' }} />}
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
      </div>
      <BottomNav />
    </div>
  );
}
