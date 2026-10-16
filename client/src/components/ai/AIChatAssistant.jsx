import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiCpu } from 'react-icons/fi';
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
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || isLoading) return;

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

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            data.reply ||
            "I couldn't process that. Please try again.",
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Sorry, I'm having trouble connecting right now. Please try again later or reach us at info@divyaputritradex.com.",
        },
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
                  <span>Online · Replies instantly</span>
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

            {/* Input */}
            <div className="ai-chat__input-wrap">
              <textarea
                ref={inputRef}
                className="ai-chat__input"
                placeholder="Ask me anything..."
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