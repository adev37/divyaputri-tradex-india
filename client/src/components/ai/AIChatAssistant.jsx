import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiCpu, FiMic, FiMicOff } from 'react-icons/fi';
import './AIChatAssistant.css';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content:
    "Hi! I'm Divya — your nano-tech assistant. Ask me about our products, industries we serve, or how we can help your business. 👋",
};

const QUICK_PROMPTS = [
  'What products do you offer?',
  'Which industries do you serve?',
  'How can I request a quote?',
];

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 🎤 Speech-to-Text (Voice Recognition)
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support voice recognition. Please use Chrome.');
      return;
    }

    // Agar pehle se listening hai to band karo
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = 'en-IN'; // Hindi ke liye 'hi-IN' use karein
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Thoda delay dekar auto-send karo taaki user ko dikhe kya type hua
      setTimeout(() => {
        sendMessage(transcript);
      }, 500);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // 🔊 Text-to-Speech (AI Reply bol kar sunayega)
  const speakReply = (text) => {
    if (!('speechSynthesis' in window)) return;
    
    // Purani awaaz rok do
    window.speechSynthesis.cancel();

    // Markdown/Emojis hata do taaki aawaz saaf aaye
    const cleanText = text.replace(/[*#_]/g, '').replace(/[\u{1F600}-\u{1F6FF}]/gu, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN';
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || isLoading) return;

    // Agar AI bol raha hai, to naya message bhejte waqt chup karao
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const userMessage = { role: 'user', content: userText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: newMessages.slice(-6),
        }),
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      const aiReply = data.reply || "I couldn't process that. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: aiReply },
      ]);

      // 🎯 AI ka reply aa gaya, ab usko bolo
      speakReply(aiReply);

    } catch (err) {
      console.error(err);
      const errorMsg = "Sorry, I'm having trouble connecting right now. Please try again later.";
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: errorMsg },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="ai-chat__fab"
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Open AI assistant"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiX size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiMessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
        {!isOpen && <span className="ai-chat__fab-pulse" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="ai-chat__header">
              <div className="ai-chat__header-info">
                <div className="ai-chat__avatar">
                  <FiCpu />
                  <span className="ai-chat__avatar-dot" />
                </div>
                <div className="ai-chat__header-text">
                  <h4>Divya AI</h4>
                  <span>{isSpeaking ? '🔊 Speaking...' : 'Online · Replies instantly'}</span>
                </div>
              </div>
              <button
                className="ai-chat__close"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <FiX />
              </button>
            </div>

            {/* Messages */}
            <div className="ai-chat__messages">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`ai-chat__msg ai-chat__msg--${msg.role}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {msg.role === 'assistant' && (
                    <div className="ai-chat__msg-avatar">
                      <FiCpu size={12} />
                    </div>
                  )}
                  <div className="ai-chat__msg-bubble">{msg.content}</div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="ai-chat__msg ai-chat__msg--assistant">
                  <div className="ai-chat__msg-avatar">
                    <FiCpu size={12} />
                  </div>
                  <div className="ai-chat__msg-bubble ai-chat__typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts (only initial) */}
            {messages.length === 1 && (
              <div className="ai-chat__quick">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    className="ai-chat__quick-btn"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area with Mic */}
            <div className="ai-chat__input-wrap">
              <button
                className={`ai-chat__mic ${isListening ? 'is-listening' : ''}`}
                onClick={startListening}
                disabled={isLoading}
                aria-label="Voice input"
              >
                {isListening ? <FiMicOff /> : <FiMic />}
              </button>
              
              <textarea
                ref={inputRef}
                className="ai-chat__input"
                placeholder="Ask me anything or click mic..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isLoading}
              />
              
              <button
                className="ai-chat__send"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
              >
                <FiSend />
              </button>
            </div>

            <div className="ai-chat__footer">
              Powered by <strong>Divya AI</strong>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}