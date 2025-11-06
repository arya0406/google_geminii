import { theme } from './theme'

export const venueCardStyles = {
  container: `${theme.spacing.card} bg-gradient-to-br ${theme.gradients.messageCard} 
    shadow-md hover:shadow-lg transition-shadow duration-300`,
    
  image: 'w-full h-48 object-cover rounded-xl mb-4',
  
  title: `${theme.typography.heading3} text-${theme.colors.foreground}`,
  
  details: 'mt-2 space-y-2',
  
  detailRow: 'flex items-center gap-2 text-sm',
  
  icon: `text-${theme.colors.primary}`,
  
  priceTag: `inline-flex items-center gap-1 px-3 py-1 rounded-full
    bg-${theme.colors.accent} text-white font-semibold`,
    
  capacity: `inline-flex items-center gap-1 px-3 py-1 rounded-full
    bg-${theme.colors.secondary} text-white font-semibold`,
    
  amenities: 'flex flex-wrap gap-2 mt-3',
  
  amenityTag: `px-2 py-1 rounded-full text-xs
    bg-${theme.colors.muted} text-${theme.colors.foreground}`,
    
  description: `${theme.typography.body} text-${theme.colors.foreground}/80
    line-clamp-2 mt-3`,
    
  button: `mt-4 w-full py-2 px-4 rounded-lg font-semibold
    bg-${theme.colors.primary} text-white
    hover:bg-${theme.colors.primary}/90 transition-colors
    active:scale-[0.98] transition-transform`
}