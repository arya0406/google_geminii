import { theme } from './theme'

export const commonStyles = {
  // Layout
  mainContainer: 'container mx-auto px-4 md:px-6 py-6',
  section: 'space-y-6',
  
  // Buttons
  primaryButton: `inline-flex items-center justify-center rounded-lg px-4 py-2
    text-sm font-medium text-primary-foreground bg-primary h-10 min-w-[100px]
    hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50
    disabled:pointer-events-none disabled:opacity-50 transition-all
    active:scale-[0.98]`,
    
  secondaryButton: `inline-flex items-center justify-center rounded-lg px-4 py-2
    text-sm font-medium bg-secondary text-secondary-foreground h-10 min-w-[100px]
    hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/50
    disabled:pointer-events-none disabled:opacity-50 transition-all
    active:scale-[0.98]`,
    
  outlineButton: `inline-flex items-center justify-center rounded-lg px-4 py-2
    text-sm font-medium border border-border bg-background h-10 min-w-[100px]
    hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50
    disabled:pointer-events-none disabled:opacity-50 transition-all
    active:scale-[0.98]`,
    
  // Inputs  
  input: `flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2
    text-sm ring-offset-background file:border-0 file:bg-transparent
    file:text-sm file:font-medium placeholder:text-muted-foreground
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
    disabled:cursor-not-allowed disabled:opacity-50`,
    
  // Cards
  card: `rounded-lg border border-border bg-card p-4 shadow-sm 
    hover:shadow-md transition-shadow`,
    
  // Animations
  fadeIn: 'animate-in fade-in duration-300',
  slideUp: 'animate-in slide-in-from-bottom-4 duration-300',
  
  // Loading states
  loading: `inline-block h-4 w-4 animate-spin rounded-full border-2
    border-primary/30 border-t-primary`,
    
  // Typography helpers  
  error: `text-sm font-medium text-red-500 dark:text-red-400`,
  success: `text-sm font-medium text-green-500 dark:text-green-400`,
  hint: theme.typography.muted
}