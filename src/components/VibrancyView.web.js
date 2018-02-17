import React from "react"

export default props => (
  <div
    style={{
      ...props.style,
      "-webkit-backdrop-filter": "blur(40px)",
      "background-color": "rgba(255, 255, 255, 0.7)",
    }}
  />
)
