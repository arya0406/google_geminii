import React from 'react';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-secondary/5 flex flex-col items-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-2 tracking-tight" style={{color: 'hsl(320 20% 40%)'}}>
          DWed - Venue Finder
        </h1>
        <p className="text-muted-foreground text-lg">Your AI-powered Wedding Planning Assistant</p>
      </div>
      <ChatInterface />
    </main>
  );
}

export default App;
