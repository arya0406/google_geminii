export const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, 
      ease: "easeOut" 
    } 
  }
};

export const headerVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      delay: 0.05, 
      duration: 0.35 
    } 
  }
};

export const messageListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06
    }
  }
};

export const messageItemVariants = {
  hidden: { 
    opacity: 0, 
    y: 8, 
    scale: 0.995 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      type: "spring", 
      stiffness: 600, 
      damping: 28, 
      mass: 0.6 
    } 
  }
};

export const typingIndicatorVariants = {
  dot: {
    y: [0, -6, 0],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 0.9,
      ease: "easeInOut",
      repeat: Infinity,
    }
  }
};

export const venueCardVariants = {
  hidden: { 
    opacity: 0, 
    y: 12, 
    scale: 0.995 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      type: "spring", 
      stiffness: 500, 
      damping: 28 
    } 
  },
  hover: { 
    y: -4, 
    boxShadow: "0 12px 30px rgba(16,24,40,0.08)", 
    transition: { 
      duration: 0.18 
    } 
  },
  tap: { 
    scale: 0.98, 
    transition: { 
      duration: 0.08 
    } 
  }
};

export const sendButtonVariants = {
  hover: { 
    scale: 1.06, 
    transition: { 
      duration: 0.12 
    } 
  },
  tap: { 
    scale: 0.94, 
    transition: { 
      duration: 0.06 
    } 
  }
};