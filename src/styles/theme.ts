import { createTheme } from "@mui/material";

declare module "@mui/material/" {
  interface Theme {
    status?: {
      error: string;
    };
  }
  interface ThemeOptions {
    status?: {
      error: string;
    };
    input?: {
      borderColor: string;
      borderRadius: number;
      margin: number;
    };
  }
}

declare module "@mui/material/styles/createMixins" {
  interface Mixins {
    input?: {
      borderColor: string;
      borderRadius: number;
    };
  }
}

export const createMuiTheme = () => {
  const theme = createTheme({
    typography: {
      fontFamily: "Poppins, sans-serif",
      body1: { fontSize: 14 },
    },
    palette: {
      error: {
        main: "#dc2626",
      },
    },
    components: {
      MuiIconButton: { defaultProps: { disableRipple: true } },
      MuiInputBase: {
        styleOverrides: {
          root: {
            "&::before": {
              border: "none !important",
              transition: "none",
            },
            "&::after": {
              border: "none !important",
              transition: "none",
            },
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableFocusRipple: true,
          disableTouchRipple: true,
          disableRipple: true,
        },
      },
    },
  });

  return theme;
};
