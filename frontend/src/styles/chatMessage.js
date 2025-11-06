import { theme } from './theme'

export const chatMessageStyles = {
  container: 'flex flex-col gap-4',
  
  userMessage: `${theme.spacing.card} ml-auto max-w-[80%]
    bg-primary text-primary-foreground
    rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl
    shadow-sm hover:shadow-md transition-shadow`,
    
  botMessage: `${theme.spacing.card} mr-auto max-w-[80%]
    bg-background border border-border
    rounded-tl-2xl rounded-tr-2xl rounded-br-2xl 
    shadow-sm hover:shadow-md transition-shadow`,
    
  text: theme.typography.base,
  
  typing: 'flex gap-2 items-center',
  
  typingDot: `w-2 h-2 rounded-full bg-primary/60
    animate-bounce [animation-delay:calc(var(--delay)*100ms)]`,
    
  timestamp: `${theme.typography.muted} mt-1`,
  
  welcomeCard: `${theme.spacing.card} w-full 
    bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5
    border border-border rounded-2xl`,
    
  welcomeTitle: theme.typography.h2,
  
  welcomeText: `${theme.typography.base} mt-2 text-muted-foreground`,
  
  suggestions: 'flex flex-wrap gap-2 mt-4',
  
  suggestionChip: `px-3 py-1.5 rounded-full text-sm font-medium
    bg-secondary/10 text-secondary-foreground
    hover:bg-secondary hover:text-secondary-foreground
    transition-colors cursor-pointer active:scale-95`
}