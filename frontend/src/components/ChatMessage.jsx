import React from 'react';
import { motion } from 'framer-motion';
import { messageItemVariants } from '../styles/motionVariants';
import VenueCard from './VenueCard';

function ChatMessage({ message }) {
  // User message - right aligned
  if (message.sender === 'user') {
    return (
      <motion.div 
        variants={messageItemVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, x: 50 }}
        className="flex justify-end mb-4"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#6f4465] text-white p-4 rounded-2xl rounded-tr-sm max-w-lg shadow-md transition-all duration-200"
        >
          <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
        </motion.div>
      </motion.div>
    );
  }

  // Bot text message - left aligned
  if (message.sender === 'bot') {
    const isList = message.content.includes('1.') && message.content.includes('2.');
    const isCeremonyInfo = message.content.includes('🕒 When:');
    const isWelcomeMessage = message.content.includes('Welcome to DWed');
    
    return (
      <motion.div 
        variants={messageItemVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, x: -50 }}
        className="flex justify-start mb-4"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={
            isWelcomeMessage 
              ? 'bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border border-border text-foreground p-6 rounded-2xl max-w-lg shadow-md transition-all duration-200'
              : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-sm p-4 max-w-lg shadow-sm transition-all duration-200'
          }>
          {isList ? (
            <div className="space-y-3">
              {message.content.split('\n').map((line, index) => (
                <p key={index} className={`text-sm md:text-base leading-relaxed
                  ${line.match(/^\d\./) 
                    ? 'font-semibold text-[#6f4465]' 
                    : 'text-gray-600'}`}>
                  {line}
                </p>
              ))}
            </div>
          ) : isCeremonyInfo ? (
            <div className="space-y-4">
              {message.content.split('\n').map((line, index) => {
                if (line.startsWith('🕒 When:')) {
                  return <p key={index} className="text-sm md:text-base font-medium text-[#6f4465] leading-relaxed">{line}</p>;
                } else if (line.startsWith('📝 What:')) {
                  return <p key={index} className="text-sm md:text-base text-gray-800 leading-relaxed">{line}</p>;
                } else if (line.startsWith('✨ Modern Touch:')) {
                  return <p key={index} className="text-sm md:text-base text-[#8b738b] leading-relaxed">{line}</p>;
                }
                return <p key={index} className="text-sm md:text-base text-gray-600 leading-relaxed">{line}</p>;
              })}
            </div>
          ) : (
            <p className="text-sm md:text-base text-gray-800 leading-relaxed">{message.content}</p>
          )}
        </motion.div>
      </motion.div>
    );
  }

  // Venues message - display venue cards
  if (message.sender === 'venues') {
    if (!message.content || message.content.length === 0) {
      const suggestions = [
        "Looking for venues in nearby areas?",
        "Would you like to explore venues with different capacity ranges?",
        "How about checking venues on different dates?",
        "I can help you find venues with specific amenities instead"
      ];

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col gap-4"
        >
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-r from-primary/5 via-background to-secondary/5 p-6 rounded-2xl max-w-lg border border-border shadow-md transition-all duration-200"
          >
            <h3 className="text-lg font-medium text-[#6f4465] mb-3">No venues found matching your criteria</h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
              Let me help you find some alternatives! Would you like to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-700">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="grid grid-cols-1 gap-4"
      >
        {message.content.map((venue, index) => (
          <VenueCard key={venue._id || index} venue={venue} />
        ))}
      </motion.div>
    );
  }

  return null;
}

export default ChatMessage;