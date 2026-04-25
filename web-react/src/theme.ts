import { createTheme } from '@mui/material/styles';

// Mirror of the SCSS palette in src/styles.scss so MUI components render with
// the same gold/charcoal/burgundy luxury palette as the Angular reference.
export const colors = {
  gold: '#D4AF37',
  goldLight: '#F4E4BC',
  goldDark: '#B8860B',
  cream: '#FDF6E3',
  creamDark: '#F5E6D3',
  charcoal: '#2C2C2C',
  charcoalLight: '#4A4A4A',
  burgundy: '#8B2635',
  burgundyDark: '#6B1F2A',
  ivory: '#FFFFF0',
  white: '#FFFFFF',
};

export const theme = createTheme({
  palette: {
    primary: { main: colors.charcoal, contrastText: colors.ivory },
    secondary: { main: colors.gold, contrastText: colors.charcoal },
    background: { default: colors.cream, paper: colors.ivory },
    text: { primary: colors.charcoal, secondary: colors.charcoalLight },
  },
  typography: {
    fontFamily: '"Cormorant Garamond", "Times New Roman", serif',
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 500 },
    h6: { fontFamily: '"Playfair Display", serif', fontWeight: 500 },
    button: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
});
