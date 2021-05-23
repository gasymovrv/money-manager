import { createMuiTheme } from '@material-ui/core';
import { blueGrey, common, green, red } from '@material-ui/core/colors';
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
    MuiIconButton: {
      label: {
        color: common.white
      },
      root: {
        color: common.white
      },
    }
  },
  palette: {
    type: 'dark',
    primary: {
      main: blueGrey['800']
    },
    secondary: {
      main: common.white
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
    },
    MuiIconButton: {
      label: {
        color: common.black
      },
      root: {
        color: common.black
      },
    }
  },
  palette: {
    type: 'light',
    primary: {
      main: blueGrey['200']
    },
    secondary: {
      main: common.black
    },
    redText: {
      main: red['800'],
    },
    greenText: {
      main: green['800'],
    },
  },
});
