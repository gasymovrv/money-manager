import { createMuiTheme } from '@material-ui/core';
import { blueGrey, common, green, grey, red } from '@material-ui/core/colors';
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
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: 15
      }
    },
    MuiButton: {
      textPrimary: {
        color: common.white
      }
    },
  },
  palette: {
    type: 'dark',
    primary: {
      main: blueGrey['800']
    },
    secondary: {
      main: grey['400']
    },
    redText: {
      main: red['200'],
      contrastText: red['900']
    },
    greenText: {
      main: green['200'],
      contrastText: green['900']
    },
  },
});

export const lightTheme: Theme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: 15
      }
    },
    MuiButton: {
      textPrimary: {
        color: common.black
      }
    }
  },
  palette: {
    type: 'light',
    primary: {
      main: blueGrey['200']
    },
    secondary: {
      main: grey['800']
    },
    redText: {
      main: red['800'],
      contrastText: red['100']
    },
    greenText: {
      main: green['800'],
      contrastText: green['100']
    },
  },
});
