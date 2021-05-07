import { createMuiTheme } from '@material-ui/core';
import { blueGrey, green, red } from '@material-ui/core/colors';
import { Theme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    redText: Palette['primary'];
    greenText: Palette['primary'];
  }

  interface PaletteOptions {
    redText: PaletteOptions['primary'];
    greenText: PaletteOptions['primary'];
  }
}

export const darkTheme: Theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: blueGrey['800']
    },
    redText: {
      main: red['200'],
    },
    greenText: {
      main: green['200'],
    },
  },
});

export const lightTheme: Theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: blueGrey['200']
    },
    redText: {
      main: red['800'],
    },
    greenText: {
      main: green['800'],
    },
  },
});
