import React from "react"
import styled from "styled-components"
import styles from "../utilities/styles"
import { bind } from "decko"

const tiers = {
  error: {
    size: 17,
    weight: 700,
    spacing: 0,
    color: "red",
  },
  title: {
    size: 25,
    weight: 900,
    spacing: -0.8,
    color: "primary",
  },
  thintitle: {
    size: 25,
    weight: 600,
    spacing: -0.8,
    color: "primary",
  },
  subtitle: {
    size: 16,
    weight: 500,
    spacing: 0,
    color: "secondary",
  },
  body: {
    size: 16,
    weight: 500,
    spacing: 0,
    color: "primary",
  },
  largebody: {
    size: 17,
    weight: 500,
    spacing: -1.2,
    color: "secondary",
  },
  label: {
    size: 15,
    weight: 500,
    spacing: 0,
    color: "tertiary",
  },
  labelerror: {
    size: 16,
    weight: 600,
    spacing: 0,
    color: "red",
  },
  emphasis: {
    size: 17,
    weight: 400,
    spacing: 0,
    color: "secondary",
  },
  emphasisSubtitle: {
    size: 16,
    weight: 300,
    // TODO
  },
  requestTitle: {
    size: 16,
    weight: 700,
    spacing: -0.3,
  },
  requestSubtitle: {
    size: 13,
    color: "rgba(0,0,0,0.5)",
  },
  messageName: {
    size: 15,
    weight: 600,
    spacing: 0,
    color: "tertiary",
  },
  messageRead: {
    size: 15,
    weight: 400,
    spacing: 0,
    color: "tertiary",
  },
  button: {
    size: 16,
    weight: 600,
    spacing: 0,
  },
}

function getColor({ tier, color, theme, button }) {
  if (button) return theme.button.text[button]
  else if (color) return color
  else if (tier) return theme.text[tiers[tier].color]
  else return "black"
}

function getSize({ tier, small, button }) {
  if (button) return tiers["button"].size
  else if (tier) return tiers[tier].size
  else return 16
}
function getWeight({ tier, small, button }) {
  if (button) return tiers["button"].weight
  else if (tier) return tiers[tier].weight
  else return 500
}

export default styled.p`
  font-size: ${getSize}px;
  font-weight: ${getWeight};
  letter-spacing: ${({ tier }) => tiers[tier].spacing || 0};
  color: ${getColor};
  margin: 0;
  padding: 0;
  ${({ center }) => center && "text-align: center"};
  ${({ opacity }) => opacity && `opacity: ${opacity}`};
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu,
    "Helvetica Neue", sans-serif;
`

export const EditableText = class EditableText extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      text: this.props.originalText,
    }
  }

  @bind
  onChange(event) {
    this.setState({
      text: event.target.value,
    })

    console.log("ON CHANGE", event.target.value)

    this.props.onTextChange(event.target.value)
  }

  render() {
    const { tier } = this.props
    const { text } = this.state

    return (
      <EditableTextInput value={text} tier={tier} onChange={this.onChange} />
    )
  }
}

const EditableTextInput = styled.input`
  font-size: ${({ tier, small }) => tiers[tier].size - (small ? 2 : 0)}px;
  font-weight: ${({ tier }) => tiers[tier].weight || 500};
  letter-spacing: ${({ tier }) => tiers[tier].spacing || 0};
  color: ${({ tier, color }) => color || tiers[tier].color || "black"};
  margin: 0;
  padding: 0;
  ${({ center }) => center && "text-align: center"};
  ${({ opacity }) => opacity && `opacity: ${opacity}`};
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  outline: none;
  border-right-width: 0;
  border-left-width: 0;
  border-top-width: 0;
  border-bottom-width: 1px;
  border-bottom-color: ${styles.colors.grey[300]};
  padding-bottom: 3px;
`
