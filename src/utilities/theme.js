import createTheme from "styled-components-theme";
import styles from "../utilities/styles";

// THEME TYPE

export type Theme = {
  fontSize: {
    label: number,
    button: number,
    body: number,
    subtitle: number,
    title_sm: number,
    title_md: number,
    title_lg: number,
  },
  background: {
    primary: string,
    secondary: string,
    tertiary: string,
  },
  border: {
    primary: string,
    secondary: string,
  },
  appColors: {
    inputOutline: string,
    cardShadow: string,
    chat_background_color: string,
  },
  colors: {
    blue: "#0F72E0",
    darkBlue: "#2B1ECE",
    indigo: "#0C158D",
    violet: "#751489",
  },
  text: {
    primary: string,
    secondary: string,
    tertiary: string,
    success: string,
    failure: string,
  },
  button: {
    disabled: {
      text: string,
      background: string,
      bottom: string,
      hover: string,
      hover_bottom: string,
      active: string,
      active_bottom: string,
    },
    default: {
      text: string,
      background: string,
      bottom: string,
      hover: string,
      hover_bottom: string,
      active: string,
      active_bottom: string,
    },
    emphasis: {
      text: string,
      background: string,
      bottom: string,
      hover: string,
      hover_bottom: string,
      active: string,
      active_bottom: string,
    },
  },
  shadow: {
    primary: string,
    secondary: string,
  },
};

const fontSize = {
  label: 14,
  button_sm: 16,
  button_md: 17,
  body: 17,
  subtitle: 17,
  title_sm: 20,
  title_md: 24,
  title_lg: 34,
};

// THEME MIXINS

const sharedTextColors = {
  success: "#5FA90F",
  failure: "#D12424",
};

const sharedColors = {
  blue: "#0F72E0",
  darkBlue: "#2B1ECE",
  indigo: "#0C158D",
  violet: "#751489",
};

// THEME INSTANCES

const LightTheme: Theme = {
  fontSize,
  background: {
    primary: "white",
    secondary: styles.colors.grey[100],
    tertiary: styles.colors.grey[200],
  },
  border: {
    primary: styles.colors.grey[300],
    secondary: styles.colors.grey[400],
  },
  appColors: {
    inputOutline: "#4A90E2",
    cardShadow: "black",
    chat_background_color: "white",
  },
  colors: sharedColors,
  text: {
    primary: styles.colors.grey[900],
    secondary: styles.colors.grey[800],
    tertiary: styles.colors.grey[600],
    ...sharedTextColors,
  },
  button: {
    disabled: {
      text: styles.colors.grey[500],
      background: styles.colors.grey[200],
      bottom: styles.colors.grey[300],
      hover: styles.colors.grey[200],
      hover_bottom: styles.colors.grey[300],
      active: styles.colors.grey[200],
      active_bottom: styles.colors.grey[300],
    },
    clear: {
      text: styles.colors.grey[800],
      background: "transparent",
      bottom: "transparent",
      hover: "transparent",
      hover_bottom: "transparent",
      active: "transparent",
      active_bottom: "transparent",
    },
    default: {
      text: styles.colors.grey[800],
      background: styles.colors.grey[300],
      bottom: styles.colors.grey[400],
      hover: styles.colors.grey[400],
      hover_bottom: styles.colors.grey[500],
      active: styles.colors.grey[400],
      active_bottom: styles.colors.grey[600],
    },
    emphasis: {
      text: "#0F72E0",
      background: "#C7E0FB",
      bottom: "#B3CDE9",
      hover: "#B0CDEC",
      hover_bottom: "#9AB5D3",
      active: "#92B4D9",
      active_bottom: "#6F94BC",
    },
  },
  shadow: {
    primary: "0 7px 24px 2px rgba(0, 0, 0, 0.11)",
    secondary:
      "0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -7px rgba(0,0,0,0.2)",
  },
};

const DarkTheme: Theme = {
  fontSize,
  background: {
    primary: styles.colors.darkblackblue[300],
    secondary: styles.colors.darkblackblue[100],
    tertiary: styles.colors.darkblackblue[200],
  },
  border: {
    primary: styles.colors.darkblackblue[400],
    secondary: styles.colors.darkblackblue[500],
  },
  appColors: {
    inputOutline: "#4A90E2",
    cardShadow: "black",
  },
  colors: sharedColors,
  text: {
    primary: styles.colors.darkblackblue[700],
    secondary: styles.colors.darkblackblue[500],
    tertiary: styles.colors.darkblackblue[600],
    ...sharedTextColors,
  },
  button: {
    disabled: {
      text: styles.colors.darkblackblue[500],
      background: styles.colors.darkblackblue[200],
      bottom: styles.colors.darkblackblue[200],
      hover: styles.colors.darkblackblue[400],
      hover_bottom: styles.colors.darkblackblue[200],
      active: styles.colors.grey[400],
      active_bottom: styles.colors.grey[200],
    },
    clear: {
      text: styles.colors.grey[800],
      background: "transparent",
      bottom: "transparent",
      hover: "transparent",
      hover_bottom: "transparent",
      active: "transparent",
      active_bottom: "transparent",
    },
    default: {
      text: styles.colors.darkblackblue[600],
      background: styles.colors.darkblackblue[300],
      bottom: styles.colors.darkblackblue[200],
      hover: styles.colors.darkblackblue[400],
      hover_bottom: styles.colors.darkblackblue[200],
      active: "#0F2343",
      active_bottom: "#00162F",
    },
    emphasis: {
      text: "#0F72E0",
      background: "#09305A",
      bottom: "#05203D",
      hover: "#004793",
      hover_bottom: "#033369",
      active: "#062343",
      active_bottom: "#00162F",
    },
  },
  shadow: {
    primary: "0 11px 30px 0px rgba(10, 65, 126, 0.54)",
    secondary: "0 15px 30px 0px rgba(10, 65, 126, 0.88)",
  },
};

const SolarizedLightTheme: Theme = {
  fontSize,
  background: {
    primary: styles.colors.solarizedlight[300],
    secondary: styles.colors.solarizedlight[100],
    tertiary: styles.colors.solarizedlight[200],
  },
  border: {
    primary: styles.colors.solarizedlight[400],
    secondary: styles.colors.solarizedlight[500],
  },
  appColors: {
    inputOutline: "#4A90E2",
    cardShadow: "black",
  },
  colors: sharedColors,
  text: {
    primary: styles.colors.solarizedlight[700],
    secondary: styles.colors.solarizedlight[500],
    tertiary: styles.colors.solarizedlight[600],
    ...sharedTextColors,
  },
  button: {
    disabled: {
      text: styles.colors.solarizedlight[500],
      background: styles.colors.solarizedlight[200],
      bottom: styles.colors.solarizedlight[200],
      hover: styles.colors.solarizedlight[400],
      hover_bottom: styles.colors.solarizedlight[200],
      active: styles.colors.grey[400],
      active_bottom: styles.colors.grey[200],
    },
    default: {
      text: styles.colors.solarizedlight[600],
      background: styles.colors.solarizedlight[300],
      bottom: styles.colors.solarizedlight[200],
      hover: styles.colors.solarizedlight[400],
      hover_bottom: styles.colors.solarizedlight[200],
      active: "#0F2343",
      active_bottom: "#00162F",
    },
    emphasis: {
      text: styles.colors.solarizeddark[600],
      background: styles.colors.solarizeddark[300],
      bottom: styles.colors.solarizeddark[200],
      hover: styles.colors.solarizeddark[400],
      hover_bottom: styles.colors.solarizeddark[200],
      active: "#0F2343",
      active_bottom: "#00162F",
    },
  },
  shadow: {
    primary: "0 7px 24px 2px rgba(0, 0, 0, 0.11)",
    secondary:
      "0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -7px rgba(0,0,0,0.2)",
  },
};

const SolarizedDarkTheme: Theme = {
  fontSize,
  background: {
    primary: styles.colors.solarizeddark[300],
    secondary: styles.colors.solarizeddark[100],
    tertiary: styles.colors.solarizeddark[200],
  },
  border: {
    primary: styles.colors.solarizeddark[400],
    secondary: styles.colors.solarizeddark[500],
  },
  appColors: {
    inputOutline: "#4A90E2",
    cardShadow: "black",
  },
  colors: sharedColors,
  text: {
    primary: styles.colors.solarizeddark[700],
    secondary: styles.colors.solarizeddark[500],
    tertiary: styles.colors.solarizeddark[600],
    ...sharedTextColors,
  },
  button: {
    disabled: {
      text: styles.colors.solarizeddark[500],
      background: styles.colors.solarizeddark[200],
      bottom: styles.colors.solarizeddark[200],
      hover: styles.colors.solarizeddark[400],
      hover_bottom: styles.colors.solarizeddark[200],
      active: styles.colors.grey[400],
      active_bottom: styles.colors.grey[200],
    },
    default: {
      text: styles.colors.solarizeddark[600],
      background: styles.colors.solarizeddark[300],
      bottom: styles.colors.solarizeddark[200],
      hover: styles.colors.solarizeddark[400],
      hover_bottom: styles.colors.solarizeddark[200],
      active: "#0F2343",
      active_bottom: "#00162F",
    },
    emphasis: {
      text: styles.colors.solarizedlight[600],
      background: styles.colors.solarizedlight[300],
      bottom: styles.colors.solarizedlight[200],
      hover: styles.colors.solarizedlight[400],
      hover_bottom: styles.colors.solarizedlight[200],
      active: "#0F2343",
      active_bottom: "#00162F",
    },
  },
  shadow: {
    primary: "0 7px 24px 2px rgba(0, 0, 0, 0.11)",
    secondary:
      "0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -7px rgba(0,0,0,0.2)",
  },
};

export const themes = [
  LightTheme,
  DarkTheme,
  SolarizedLightTheme,
  SolarizedDarkTheme,
];

const theme = createTheme(...Object.keys(LightTheme));
export default theme;
