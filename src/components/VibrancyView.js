import React from "react"
import { VibrancyView } from "react-native-blur"

export default ({ blurType, blurAmount, style }) => (
  <VibrancyView
    blurType={blurType}
    blurAmount={blurAmount}
    style={style}
    key="vibrancy_view"
  />
)
