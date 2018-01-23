import React from "react"
import ReactNative from "react-native"
import App from "./App"

import iconFont from "react-native-vector-icons/Fonts/Feather.ttf"
const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: Feather;
}`

// Create stylesheet
const style = document.createElement("style")
style.type = "text/css"
if (style.styleSheet) {
  style.styleSheet.cssText = iconFontStyles
} else {
  style.appendChild(document.createTextNode(iconFontStyles))
}

// Inject stylesheet
document.head.appendChild(style)

ReactNative.render(<App />, document.getElementById("root"))
