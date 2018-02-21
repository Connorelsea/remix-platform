import React from "react"
import ReactNative from "react-native"
import { AppContainer } from "react-hot-loader"
import App from "./AppContainer"

import iconFont from "react-native-vector-icons/Fonts/Feather.ttf"
const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: Feather;
}

.switch-wrapper {
  position: relative;
}

.switch-wrapper > div {
  position: absolute;
}
`

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

if (process.env.NODE_ENV !== "production") {
  const { whyDidYouUpdate } = require("why-did-you-update")
  whyDidYouUpdate(React)
}

console.log("RENDERING APP CONTAINER")

const render = Component => {
  ReactNative.render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById("root")
  )
}

render(App)

// if (module.hot) {
//   module.hot.accept("./AppContainer", () => render(App))
// }
