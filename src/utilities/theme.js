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
    title_lg: number
  },
  appColors: {
    inputOutline: string,
    cardShadow: string
  },
  background: {
    primary: string,
    secondary: string,
    tertiary: string
  },
  text: {
    primary: string,
    secondary: string,
    tertiary: string,
    success: string,
    failure: string
  },
  button: {
    background: {
      default: string,
      emphasis: string
    },
    text: {
      default: string,
      emphasis: string
    }
  }
};

const fontSize = {
  label: 14,
  button_sm: 16,
  button_md: 17,
  body: 17,
  subtitle: 17,
  title_sm: 20,
  title_md: 24,
  title_lg: 30
};

// THEME INSTANCES

const LightTheme: Theme = {
  fontSize,
  background: {
    primary: "white",
    secondary: styles.colors.grey[100],
    tertiary: styles.colors.grey[200]
  },
  appColors: {
    inputOutline: "#4A90E2",
    cardShadow: "black"
  },
  text: {
    primary: styles.colors.grey[900],
    secondary: styles.colors.grey[800],
    tertiary: styles.colors.grey[600],
    success: "#5FA90F",
    failure: "#D12424"
  },
  button: {
    disabled: {
      text: styles.colors.grey[500],
      background: styles.colors.grey[200],
      bottom: styles.colors.grey[300],
      hover: styles.colors.grey[200],
      hover_bottom: styles.colors.grey[300],
      active: styles.colors.grey[200],
      active_bottom: styles.colors.grey[300]
    },
    default: {
      text: styles.colors.grey[800],
      background: styles.colors.grey[300],
      bottom: styles.colors.grey[400],
      hover: styles.colors.grey[400],
      hover_bottom: styles.colors.grey[500],
      active: styles.colors.grey[400],
      active_bottom: styles.colors.grey[600]
    },
    emphasis: {
      text: "#0F72E0",
      background: "#C7E0FB",
      bottom: "#B3CDE9",
      hover: "#B0CDEC",
      hover_bottom: "#9AB5D3",
      active: "#92B4D9",
      active_bottom: "#6F94BC"
    }
  }
};

const DarkTheme: Theme = {
  fontSize,
  background: {
    primary: "black",
    secondary: "#26252F",
    tertiary: "#59576C"
  },
  text: {
    primary: styles.colors.grey[100],
    secondary: styles.colors.grey[200],
    tertiary: styles.colors.grey[300]
  }
};

const SolarizedDarkTheme: Theme = {};

export const themes = [LightTheme, DarkTheme, SolarizedDarkTheme];

const theme = createTheme(...Object.keys(LightTheme));
export default theme;
