import React from "react"

export default props => (
  <div
    style={{
      ...props.style,
      height: props.height,
      maxHeight: props.height,
      minHeight: props.height,
      "-webkit-backdrop-filter": "blur(40px)",
      "backdrop-filter": " blur(40px)",
      // "-webkit-filter": "blur(6px)",
      // "-moz-filter": "blur(6px)",
      // "-o-filter": "blur(6px)",
      // "-ms-filter": "blur(6px)",
      "background-color": props.color
        ? props.color
        : "rgba(255, 255, 255, 0.7)",
      // "box-shadow": "0px 7px 13px -4px rgba(0, 0, 0, 0.1)",
      transition: "background-color 0.3s",
    }}
  />
)
