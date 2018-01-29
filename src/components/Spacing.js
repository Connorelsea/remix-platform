import styled from "styled-components/native"

export default styled.View`
  height: ${props => props.size}px;
  background-color: ${props => props.color || "transparent"};
  width: ${props => (props.fullwidth ? "100%" : props.size + "px")};
`
