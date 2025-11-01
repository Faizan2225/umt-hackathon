module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Custom accent colors
        accent: {
          coral: '#FF6F61',
          mint: '#48e6c1',
        },
      },
      boxShadow: {
        glass: '0 4px 32px 0 rgba(60,60,130,0.14), 0 1.5px 4px 0 rgba(70,0,120,0.07)',
        glow: '0 0 0 3px #a78bfa55',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },
      backgroundImage: {
        'campus-gradient':
          'linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 40%, #c4b5fd 70%, #f0abfc 100%)',
        'campus-gradient-dark':
          'linear-gradient(135deg, #312e81 0%, #6366f1 50%, #a21caf 100%)',
        'dots':
          'radial-gradient(#6366f1 1.5px, transparent 1.5px), radial-gradient(#c4b5fd 1.5px, transparent 1.5px)',
      },
    },
  },
  plugins: [],
};
