export const theme = {
  colors: {
    primary: {
      DEFAULT: 'hsl(320 30% 40%)',
      light: 'hsl(320 30% 95%)',
      foreground: 'hsl(0 0% 100%)'
    },
    secondary: {
      DEFAULT: 'hsl(170 50% 60%)',
      light: 'hsl(170 50% 95%)',
      foreground: 'hsl(0 0% 100%)'
    },
    accent: {
      DEFAULT: 'hsl(15 80% 60%)',
      light: 'hsl(15 80% 95%)',
      foreground: 'hsl(0 0% 100%)'
    },
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(320 20% 20%)',
    muted: {
      DEFAULT: 'hsl(0 0% 96%)',
      foreground: 'hsl(320 20% 40%)'
    },
    border: 'hsl(320 10% 90%)',
  },
  gradients: {
    welcomeCard: 'from-primary/5 via-secondary/5 to-accent/5',
    messageCard: 'from-muted to-background',
  },
  typography: {
    h1: 'text-4xl font-serif font-bold tracking-tight',
    h2: 'text-3xl font-serif font-bold tracking-tight',
    h3: 'text-2xl font-semibold',
    h4: 'text-xl font-semibold',
    large: 'text-lg font-medium',
    base: 'text-base leading-7',
    small: 'text-sm font-medium text-muted-foreground',
    muted: 'text-sm text-muted-foreground',
  },
  spacing: {
    container: 'max-w-3xl mx-auto p-6',
    section: 'my-6',
    card: 'p-4 rounded-2xl',
  }
}