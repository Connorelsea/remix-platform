import React from "react";
import ReactNative from "react-native";
import { AppContainer as HotContainer } from "react-hot-loader";
import AppProviders from "./AppProviders";
import iconFont from "react-native-vector-icons/Fonts/Feather.ttf";

// Init element queries

import ResizeSensor from "css-element-queries/src/ResizeSensor";
import ElementQueries from "css-element-queries/src/ElementQueries";

ElementQueries.listen();

// Uses the webpack cache url to set the font family

const iconFontStyles = `
  @font-face {
    src: url(${iconFont});
    font-family: Feather;
  }
`;

// Create stylesheet
const style = document.createElement("style");
style.type = "text/css";

if (style.styleSheet) {
  style.styleSheet.cssText = iconFontStyles;
} else {
  style.appendChild(document.createTextNode(iconFontStyles));
}

// Inject stylesheet
document.head.appendChild(style);

if (process.env.NODE_ENV !== "production") {
  const { whyDidYouUpdate } = require("why-did-you-update");
  whyDidYouUpdate(React);
}

const render = Component => {
  ReactNative.render(
    <HotContainer>
      <Component />
    </HotContainer>,
    document.getElementById("root")
  );
};

render(AppProviders);
