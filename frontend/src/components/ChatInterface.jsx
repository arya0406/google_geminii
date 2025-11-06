import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Send, Bot, X, MessageCircle, Minimize2 } from 'lucide-react';
import { cn } from '../lib/utils';
import ChatMessage from './ChatMessage';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        sender: 'bot',
        content: `👋 Welcome to DWed!

I can help you with:
1. Wedding Venues 🏰
2. Indian Wedding Ceremonies 🎉
3. Wedding Traditions ✨

What would you like to know about?`
      };
      setMessages([welcomeMessage]);
    }
    // We only want to show the welcome message once when the component mounts,
    // regardless of messages.length changes, so we intentionally omit it from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
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
        setMessages(prev => [...prev, { sender: 'venues', content: data.data }]);
        setTimeout(scrollToBottom, 150);
      } else if (data.type === 'text') {
        setMessages(prev => [...prev, { sender: 'bot', content: data.data }]);
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Responsive dimensions
  const getChatDimensions = () => {
    if (isMobile) {
      return 'w-[calc(100vw-2rem)] h-[calc(100vh-8rem)] bottom-4 right-4';
    }
    return 'w-full max-w-2xl h-[600px] bottom-6 right-6';
  };

  const getFullScreenClass = () => {
    if (isMobile && isOpen) {
      return 'fixed inset-0 z-50 h-screen w-screen rounded-none';
    }
    return `fixed ${getChatDimensions()} z-50 flex-col rounded-2xl`;
  };

  return (
    <>
      {/* Floating Button - Hidden on mobile when chat is open */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed z-50 flex items-center justify-center rounded-full bg-[#6f4465] text-white shadow-lg transition-all hover:scale-110 hover:bg-[#5a3752]',
          isMobile
            ? 'bottom-4 right-4 h-12 w-12'
            : 'bottom-6 right-6 h-14 w-14',
          isOpen && 'hidden'
        )}
        size="icon"
      >
        <MessageCircle className={cn(isMobile ? 'h-5 w-5' : 'h-6 w-6')} />
      </Button>

      {/* Chat Interface */}
      <div
        className={cn(
          'flex border border-[#8b738b]/20 bg-white shadow-2xl transition-all duration-300',
          getFullScreenClass(),
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-4 opacity-0 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#6f4465] px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl sm:rounded-t-2xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 bg-white/20 border border-white/30">
              <AvatarFallback className="bg-transparent text-white">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-white text-sm sm:text-base">
                DWed AI
              </h2>
              <p className="text-xs text-white/80">Online</p>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-white/20 text-white hover:text-white"
              >
                <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-white/20 text-white hover:text-white"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 bg-gray-50/50">
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
                className="flex gap-3 items-start"
              >
                <Avatar className="h-8 w-8 bg-[#6f4465] border border-[#6f4465]/20">
                  <AvatarFallback className="bg-transparent text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#6f4465] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-[#6f4465] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-[#6f4465] rounded-full animate-bounce"></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white p-3 sm:p-4 rounded-b-2xl sm:rounded-b-2xl">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about venues, ceremonies, or wedding traditions..."
              className="flex-1 bg-white border-gray-300 focus-visible:ring-[#6f4465] focus:border-[#6f4465] text-sm sm:text-base"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className={cn(
                'shrink-0 bg-[#6f4465] text-white hover:bg-[#5a3752] border-0 transition-all duration-200 transform hover:scale-105 active:scale-95',
                isMobile ? 'h-9 w-9' : 'h-10 w-10'
              )}
            >
              <Send className={cn(isMobile ? 'h-3 w-3' : 'h-4 w-4')} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatInterface;