import React from "react"

export default props => (
  <div
    style={{
      ...props.style,
      "-webkit-backdrop-filter": "blur(40px)",
      "backdrop-filter": " blur(40px)",
      // "-webkit-filter": "blur(6px)",
      // "-moz-filter": "blur(6px)",
      // "-o-filter": "blur(6px)",
      // "-ms-filter": "blur(6px)",
      "background-color": props.color
        ? props.color
        : "rgba(255, 255, 255, 0.7)",
    }}
  />
)
