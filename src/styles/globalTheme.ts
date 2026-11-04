import { createTheme, PaletteMode, PaletteOptions } from "@mui/material";

export const globalTheme = createTheme({
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    body1: { fontSize: 14 },
    h1: {
      fontSize: "clamp(2.25rem, 4vw, 3.75rem)",
      fontWeight: 600,
      lineHeight: 0.98,
      letterSpacing: "-0.055em",
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700,
      letterSpacing: "-0.035em",
    },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        gutters: {
          fontSize: 14,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          ".MuiInputBase-formControl": {
            marginTop: 0,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.shape.borderRadius,
          fontSize: 14,
          "&.Mui-error": {
            ".MuiInput-input": {
              borderColor: theme.palette.error.main,
            },
          },
        }),
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          ".MuiInputBase-input.MuiOutlinedInput-input": {
            border: "none",
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: ({ theme }) => ({
          wordBreak: "break-word",
          width: "100%",
          "th.MuiTableCell-head": {
            border: 0,
            color: theme.palette.text.secondary,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: ".09em",
            padding: "10px 14px",
            textTransform: "uppercase",
          },
          "td.MuiTableCell-body": {
            border: 0,
            color: theme.palette.text.secondary,
            padding: "14px",
          },
        }),
      },
    },
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
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 700,
          textTransform: "none",
        },
      },
    },
  },
});

export function getThemePalette(mode: PaletteMode): PaletteOptions {
  if (mode === "dark") {
    return {
      mode,
      primary: {
        main: "#75C544",
        light: "#9CDD75",
        dark: "#0E2406",
        contrastText: "#15370D",
      },
      secondary: {
        main: "#14E9FE",
        light: "#9CDD75",
        dark: "#1D4F00",
        contrastText: "#15370D",
      },
      info: {
        main: "#14E9FE",
        contrastText: "#15370D",
      },
      background: {
        default: "#0E2406",
        paper: "#15370D",
      },
      text: {
        primary: "#F4F8F1",
        secondary: "#B9DDA8",
      },
      divider: "rgba(156, 221, 117, 0.24)",
      error: {
        main: "#FF8A80",
      },
    };
  }

  return {
    mode,
    primary: {
      main: "#1D4F00",
      light: "#F4F8F1",
      dark: "#15370D",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#75C544",
      light: "#9CDD75",
      dark: "#1D4F00",
      contrastText: "#15370D",
    },
    info: {
      main: "#14E9FE",
      contrastText: "#15370D",
    },
    background: {
      default: "#F4F8F1",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#15370D",
      secondary: "#4D6447",
    },
    divider: "rgba(29, 79, 0, 0.16)",
    error: {
      main: "#B42318",
    },
  };
}
