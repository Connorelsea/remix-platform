import createTheme from "styled-components-theme"
import styles from "../utilities/styles"

// THEME TYPE

export type Theme = {
  background: {
    primary: string,
    secondary: string,
    tertiary: string,
  },
  text: {
    primary: string,
    secondary: string,
    tertiary: string,
  },
  button: {
    background: {
      default: string,
      emphasis: string,
    },
    text: {
      default: string,
      emphasis: string,
    },
  },
}

// THEME INSTANCES

const LightTheme: Theme = {
  background: {
    primary: "white",
    secondary: styles.colors.grey[100],
    tertiary: styles.colors.grey[200],
  },
  text: {
    primary: "black",
    secondary: styles.colors.grey[500],
    tertiary: styles.colors.grey[400],
  },
  button: {
    background: {
      default: "#D1D5DB",
      emphasis: "#CDE2F9",
    },
    text: {
      default: "black",
      emphasis: "#0F72E0",
    },
  },
}

const DarkTheme: Theme = {
  background: {
    primary: "black",
    secondary: "#26252F",
    tertiary: "#59576C",
  },
  text: {
    primary: "black",
    secondary: "",
    tertiary: "",
  },
}

const SolarizedDarkTheme: Theme = {}

export const themes = [LightTheme, DarkTheme, SolarizedDarkTheme]

const theme = createTheme(...Object.keys(LightTheme))
export default theme
