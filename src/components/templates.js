// src/templates.js

// Define different presentation templates
// Each template includes a name, a unique ID, and a set of CSS variables
// that will define its look and feel.

const templates = [
  {
    id: 'default-modern',
    name: 'Default Modern',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#00C9FF', // Bright Cyan
      '--template-secondary': '#92FE9D', // Bright Green
      '--template-accent': '#FF6B6B', // Vibrant Red (for bullets/highlights)
      '--template-text': '#E0E0E0', // Light Gray
      '--template-light-text': '#A0A0A0',
      '--template-background': 'rgba(25, 25, 40, 0.85)', // Dark card background
      '--template-border': 'rgba(0, 201, 255, 0.3)',
      '--template-shadow': '0 8px 25px rgba(0, 0, 0, 0.4)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'dark-elegance',
    name: 'Dark Elegance',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#BB86FC', // Light Purple
      '--template-secondary': '#03DAC6', // Teal
      '--template-accent': '#FFEB3B', // Yellow (for bullets/highlights)
      '--template-text': '#E0E0E0',
      '--template-light-text': '#B0B0B0',
      '--template-background': '#121212', // Very dark background
      '--template-border': '#333333',
      '--template-shadow': '0 8px 20px rgba(0, 0, 0, 0.6)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'clean-minimal',
    name: 'Clean Minimal',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#607D8B', // Blue Grey
      '--template-secondary': '#FFC107', // Amber
      '--template-accent': '#4CAF50', // Green (for bullets/highlights)
      '--template-text': '#212121', // Dark text
      '--template-light-text': '#757575',
      '--template-background': '#FFFFFF', // Pure white
      '--template-border': '#BDBDBD',
      '--template-shadow': '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#2980B9',
      '--template-secondary': '#3498DB',
      '--template-accent': '#E74C3C', // Red (for bullets/highlights)
      '--template-text': '#2C3E50',
      '--template-light-text': '#7F8C8D',
      '--template-background': '#ECF0F1',
      '--template-border': '#BDC3C7',
      '--template-shadow': '0 3px 10px rgba(0,0,0,0.15)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#0FF', // Cyan Neon
      '--template-secondary': '#F0F', // Magenta Neon
      '--template-accent': '#0F0', // Green Neon (for bullets/highlights)
      '--template-text': '#E0E0E0',
      '--template-light-text': '#A0A0A0',
      '--template-background': '#0A0A1A', // Very dark blue
      '--template-border': 'rgba(0, 255, 255, 0.5)',
      '--template-shadow': '0 0 20px rgba(0, 255, 255, 0.4), 0 0 10px rgba(255, 0, 255, 0.3)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'futuristic-tech',
    name: 'Futuristic Tech',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#4CAF50', // Green
      '--template-secondary': '#2196F3', // Blue
      '--template-accent': '#FF9800', // Orange (for bullets/highlights)
      '--template-text': '#E0E0E0',
      '--template-light-text': '#B0B0B0',
      '--template-background': '#263238', // Dark Blue Grey
      '--template-border': 'rgba(76, 175, 80, 0.4)',
      '--template-shadow': '0 10px 30px rgba(0, 0, 0, 0.5)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'deep-space',
    name: 'Deep Space',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#8E24AA', // Deep Purple
      '--template-secondary': '#D81B60', // Pink
      '--template-accent': '#FFEB3B', // Yellow (for bullets/highlights)
      '--template-text': '#F5F5F5',
      '--template-light-text': '#C5CAE9',
      '--template-background': '#212121', // Almost black
      '--template-border': 'rgba(142, 36, 170, 0.4)',
      '--template-shadow': '0 12px 40px rgba(0, 0, 0, 0.6)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'vibrant-gradient',
    name: 'Vibrant Gradient',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#FF416C', // Red
      '--template-secondary': '#FF4B2B', // Orange
      '--template-accent': '#FFD700', // Gold (for bullets/highlights)
      '--template-text': '#FFFFFF',
      '--template-light-text': '#F0F0F0',
      '--template-background': 'linear-gradient(135deg, #FF416C, #FF4B2B)', // Gradient background
      '--template-border': 'rgba(255, 255, 255, 0.3)',
      '--template-shadow': '0 10px 30px rgba(0, 0, 0, 0.4)',
    },
    styles: {
      slideBackground: 'var(--template-background)', // This will be the gradient
      titleColor: 'var(--template-text)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-accent)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'modern-blue-new',
    name: 'Modern Blue (Clean)',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#007bff', // Bright Blue
      '--template-secondary': '#0056b3', // Darker Blue
      '--template-background': '#f8f9fa', // Light Gray Background
      '--template-text': '#343a40', // Dark Gray Text
      '--template-light-text': '#A0A0A0',
      '--template-accent': '#28a745', // Green Accent for bullets/highlights
      '--template-border': 'rgba(0, 0, 0, 0.1)',
      '--template-shadow': '0 10px 20px rgba(0, 0, 0, 0.15)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'minimal-green-new',
    name: 'Minimal Green (Fresh)',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#28a745', // Green
      '--template-secondary': '#218838', // Darker Green
      '--template-background': '#ffffff', // Pure White
      '--template-text': '#333333', // Dark Gray
      '--template-light-text': '#757575',
      '--template-accent': '#007bff', // Blue Accent for bullets/highlights
      '--template-border': 'rgba(0, 0, 0, 0.05)',
      '--template-shadow': '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'earthy-tones-new',
    name: 'Earthy Tones (Natural)',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#4a4a4a', // Dark Gray
      '--template-secondary': '#795548', // Brown
      '--template-background': '#f5f5dc', // Beige
      '--template-text': '#3e2723', // Dark Brown Text
      '--template-light-text': '#757575',
      '--template-accent': '#8bc34a', // Light Green Accent for bullets/highlights
      '--template-border': 'rgba(0, 0, 0, 0.1)',
      '--template-shadow': '0 6px 12px rgba(0, 0, 0, 0.1)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'soft-pastel-new',
    name: 'Soft Pastel (Calm)',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#6d6d6d', // Medium Gray
      '--template-secondary': '#b2ebf2', // Light Blue
      '--template-background': '#e0f2f7', // Very Light Blue
      '--template-text': '#424242', // Dark Gray Text
      '--template-light-text': '#757575',
      '--template-accent': '#ffccbc', // Light Peach Accent for bullets/highlights
      '--template-border': 'rgba(0, 0, 0, 0.08)',
      '--template-shadow': '0 5px 15px rgba(0, 0, 0, 0.08)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'professional-grey',
    name: 'Professional Grey',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#424242', // Dark Grey
      '--template-secondary': '#757575', // Medium Grey
      '--template-accent': '#607D8B', // Blue Grey (for bullets/highlights)
      '--template-text': '#212121', // Very Dark Grey Text
      '--template-light-text': '#9E9E9E',
      '--template-background': '#F5F5F5', // Light Grey Background
      '--template-border': '#BDBDBD',
      '--template-shadow': '0 2px 5px rgba(0, 0, 0, 0.05)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'sunny-yellow',
    name: 'Sunny Yellow',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#FFC107', // Amber
      '--template-secondary': '#FF9800', // Orange
      '--template-accent': '#4CAF50', // Green (for bullets/highlights)
      '--template-text': '#424242', // Dark Grey Text
      '--template-light-text': '#757575',
      '--template-background': '#FFFDE7', // Very Light Yellow Background
      '--template-border': '#FFECB3',
      '--template-shadow': '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#673AB7', // Deep Purple
      '--template-secondary': '#9575CD', // Medium Purple
      '--template-accent': '#FF4081', // Pink Accent (for bullets/highlights)
      '--template-text': '#E0E0E0', // Light Grey Text
      '--template-light-text': '#BDBDBD',
      '--template-background': '#311B92', // Darker Purple Background
      '--template-border': 'rgba(103, 58, 183, 0.4)',
      '--template-shadow': '0 8px 20px rgba(0, 0, 0, 0.4)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'subtle-waves',
    name: 'Subtle Waves',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#3F51B5', // Indigo
      '--template-secondary': '#90CAF9', // Light Blue
      '--template-accent': '#FFC107', // Amber (for bullets/highlights)
      '--template-text': '#212121', // Dark Text
      '--template-light-text': '#757575',
      // Subtle wave pattern background using linear-gradient
      '--template-background': 'linear-gradient(135deg, #E3F2FD 25%, transparent 25%) -50px 0, linear-gradient(225deg, #E3F2FD 25%, transparent 25%) -50px 0, linear-gradient(315deg, #E3F2FD 25%, transparent 25%) 0 0, linear-gradient(45deg, #E3F2FD 25%, #BBDEFB 25%) 0 0',
      '--template-background-size': '100px 100px', // Define size for the pattern
      '--template-border': '#BBDEFB',
      '--template-shadow': '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      backgroundSize: 'var(--template-background-size)', // Apply background size for pattern
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'geometric-dark',
    name: 'Geometric Dark',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#00BCD4', // Cyan
      '--template-secondary': '#FF5722', // Deep Orange
      '--template-accent': '#8BC34A', // Light Green (for bullets/highlights)
      '--template-text': '#E0E0E0',
      '--template-light-text': '#B0B0B0',
      // Geometric pattern background
      '--template-background': 'repeating-linear-gradient(45deg, #212121 0, #212121 10px, #263238 10px, #263238 20px)',
      '--template-border': 'rgba(0, 188, 212, 0.4)',
      '--template-shadow': '0 10px 25px rgba(0, 0, 0, 0.6)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#2196F3', // Blue
      '--template-secondary': '#81D4FA', // Light Blue
      '--template-accent': '#00BCD4', // Cyan (for bullets/highlights)
      '--template-text': '#263238', // Dark Blue Grey Text
      '--template-light-text': '#607D8B',
      '--template-background': '#E0F7FA', // Very Light Cyan Background
      '--template-border': '#B3E5FC',
      '--template-shadow': '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#388E3C', // Dark Green
      '--template-secondary': '#8BC34A', // Light Green
      '--template-accent': '#FFEB3B', // Yellow (for bullets/highlights)
      '--template-text': '#2E7D32', // Darker Green Text
      '--template-light-text': '#9CCC65',
      '--template-background': '#DCEDC8', // Very Light Green Background
      '--template-border': '#A5D6A7',
      '--template-shadow': '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#FF5722', // Deep Orange
      '--template-secondary': '#FFC107', // Amber
      '--template-accent': '#F44336', // Red (for bullets/highlights)
      '--template-text': '#FFFFFF',
      '--template-light-text': '#FFECB3',
      '--template-background': 'linear-gradient(135deg, #FF5722 0%, #FFC107 100%)', // Orange to Amber Gradient
      '--template-border': 'rgba(255, 255, 255, 0.3)',
      '--template-shadow': '0 10px 30px rgba(0, 0, 0, 0.4)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-text)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-accent)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'cool-grey',
    name: 'Cool Grey',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#607D8B', // Blue Grey
      '--template-secondary': '#90A4AE', // Light Blue Grey
      '--template-accent': '#78909C', // Darker Blue Grey (for bullets/highlights)
      '--template-text': '#263238', // Very Dark Blue Grey Text
      '--template-light-text': '#B0BEC5',
      '--template-background': '#ECEFF1', // Very Light Blue Grey Background
      '--template-border': '#CFD8DC',
      '--template-shadow': '0 3px 10px rgba(0, 0, 0, 0.08)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'warm-vintage',
    name: 'Warm Vintage',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#795548', // Brown
      '--template-secondary': '#A1887F', // Light Brown
      '--template-accent': '#FFAB00', // Amber (for bullets/highlights)
      '--template-text': '#3E2723', // Dark Brown Text
      '--template-light-text': '#BCAAA4',
      '--template-background': '#EFEBE9', // Off-White Background
      '--template-border': '#D7CCC8',
      '--template-shadow': '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'high-contrast-dark',
    name: 'High Contrast Dark',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#00E676', // Bright Green Accent
      '--template-secondary': '#FF1744', // Bright Red Accent
      '--template-accent': '#FFD600', // Bright Yellow (for bullets/highlights)
      '--template-text': '#FFFFFF',
      '--template-light-text': '#B0B0B0',
      '--template-background': '#000000', // Pure Black Background
      '--template-border': 'rgba(0, 230, 118, 0.5)',
      '--template-shadow': '0 0 20px rgba(0, 230, 118, 0.6)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'soft-geometric',
    name: 'Soft Geometric',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#64B5F6', // Light Blue
      '--template-secondary': '#81C784', // Light Green
      '--template-accent': '#FFB74D', // Light Orange (for bullets/highlights)
      '--template-text': '#424242',
      '--template-light-text': '#90A4AE',
      '--template-background': 'linear-gradient(45deg, #E3F2FD 25%, transparent 25%) 0 0, linear-gradient(135deg, #E3F2FD 25%, transparent 25%) 0 0, linear-gradient(225deg, #E3F2FD 25%, transparent 25%) 0 0, linear-gradient(315deg, #E3F2FD 25%, #BBDEFB 25%) 0 0', // Subtle geometric gradient
      '--template-background-size': '40px 40px',
      '--template-border': '#BBDEFB',
      '--template-shadow': '0 4px 10px rgba(0, 0, 0, 0.08)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      backgroundSize: 'var(--template-background-size)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  {
    id: 'paper-texture',
    name: 'Paper Texture',
    layoutType: 'text-only',
    colors: {
      '--template-primary': '#4E342E', // Dark Brown
      '--template-secondary': '#8D6E63', // Medium Brown
      '--template-accent': '#FFAB00', // Amber (for bullets/highlights)
      '--template-text': '#3E2723',
      '--template-light-text': '#A1887F',
      // Subtle paper texture background (using a very light noise pattern)
      '--template-background': 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' stroke=\'#E0E0E0\' stroke-width=\'0.5\' fill=\'#F5F5F5\' filter=\'url(%23noiseFilter)\' opacity=\'0.2\'/%3E%3C/svg%3E")',
      '--template-border': '#D7CCC8',
      '--template-shadow': '0 3px 10px rgba(0, 0, 0, 0.1)',
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-primary)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-secondary)',
      boxShadow: 'var(--template-shadow)',
    }
  },
  // NEW TEMPLATES FROM IMAGES
  {
    id: 'teal-red-accent',
    name: 'Teal & Red Accent',
    layoutType: 'accent-corner', // New layout type for specific styling
    colors: {
      '--template-primary': '#E74C3C', // Red accent color
      '--template-secondary': '#2F6F7C', // Dark Teal background
      '--template-accent': '#FFEB3B', // Yellow for bullets/highlights
      '--template-text': '#E0E0E0',
      '--template-light-text': '#B0B0B0',
      '--template-background': '#2F6F7C', // Dark Teal background
      '--template-border': 'rgba(231, 76, 60, 0.4)',
      '--template-shadow': '0 8px 20px rgba(0, 0, 0, 0.5)',
      '--template-accent-shape-color': '#E74C3C', // Specific color for the corner shape
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-text)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-border)',
      boxShadow: 'var(--template-shadow)',
      accentShapeColor: 'var(--template-accent-shape-color)', // Pass to SlidePreview
    }
  },
  {
    id: 'blue-green-accent',
    name: 'Blue & Green Accent',
    layoutType: 'accent-corner', // New layout type for specific styling
    colors: {
      '--template-primary': '#92FE9D', // Lime Green accent color
      '--template-secondary': '#347AB7', // Blue background
      '--template-accent': '#FFEB3B', // Yellow for bullets/highlights
      '--template-text': '#E0E0E0',
      '--template-light-text': '#B0B0B0',
      '--template-background': '#347AB7', // Blue background
      '--template-border': 'rgba(146, 254, 157, 0.4)',
      '--template-shadow': '0 8px 20px rgba(0, 0, 0, 0.5)',
      '--template-accent-shape-color': '#92FE9D', // Specific color for the corner shape
    },
    styles: {
      slideBackground: 'var(--template-background)',
      titleColor: 'var(--template-text)',
      bulletColor: 'var(--template-text)',
      borderColor: 'var(--template-border)',
      boxShadow: 'var(--template-shadow)',
      accentShapeColor: 'var(--template-accent-shape-color)', // Pass to SlidePreview
    }
  }
];

export default templates;
