import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    // Use setTimeout to ensure DOM is updated before scrolling
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 0);
  };

  // Show welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {  // Only show welcome message if no messages exist
      const welcomeMessage = {
        sender: 'bot',
        content: `👋 Welcome to DWed!

I can help you with:
1. Wedding Venues 🏰
2. Indian Wedding Ceremonies 🎉
3. Wedding Traditions ✨

What would you like to know about?`
      };
      
      setMessages([welcomeMessage]);  // Set directly without typing effect for welcome
    }
  }, [messages.length]); // Added messages.length as dependency

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]); // Scroll on every message update

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add user message to state
    const userMessage = { sender: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and set loading
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Send request to backend
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();

      // Add bot response to messages
      if (data.type === 'venues') {
        // For venue results, add message immediately and scroll with a slight delay for rendering
        setMessages(prev => [...prev, { sender: 'venues', content: data.data }]);
        // Scroll after message is rendered and animations start
        setTimeout(scrollToBottom, 150);
      } else if (data.type === 'text') {
        setMessages(prev => [...prev, { sender: 'bot', content: data.data }]);
        // Scroll for text messages too
        setTimeout(scrollToBottom, 50);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        content: 'Sorry, I encountered an error. Please make sure the backend server is running.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white shadow-2xl rounded-lg border border-gray-200 flex flex-col">
      {/* Message History */}
      <motion.div 
        className="h-[60vh] overflow-y-auto p-6 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence mode="sync">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <ChatMessage message={message} />
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-gray-500 italic flex items-center gap-2"
            >
              <motion.span
                animate={{
                  opacity: [0.4, 1, 0.4],
                  transition: { duration: 1.5, repeat: Infinity }
                }}
              >
                Bot is thinking
              </motion.span>
              <motion.span
                animate={{
                  opacity: [0.4, 1, 0.4],
                  transition: { duration: 1.5, repeat: Infinity, delay: 0.2 }
                }}
              >
                .
              </motion.span>
              <motion.span
                animate={{
                  opacity: [0.4, 1, 0.4],
                  transition: { duration: 1.5, repeat: Infinity, delay: 0.4 }
                }}
              >
                .
              </motion.span>
              <motion.span
                animate={{
                  opacity: [0.4, 1, 0.4],
                  transition: { duration: 1.5, repeat: Infinity, delay: 0.6 }
                }}
              >
                .
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </motion.div>

      {/* Input Form */}
      <form 
        onSubmit={handleSubmit} 
        className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white"
      >
        <div className="flex items-center space-x-4">
          <div className="flex-grow relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about venues, ceremonies, or wedding traditions..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 text-white py-3 px-8 rounded-xl font-medium hover:bg-blue-600 disabled:bg-gray-400 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md disabled:shadow-none disabled:transform-none"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;
