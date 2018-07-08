import styled, { css } from "styled-components";
import { ifProp } from "styled-tools";
import { Link } from "react-router-dom";

export default styled(Link)`
  background-color: ${p => p.theme.background.primary};
  padding: 15px;
  border-radius: 8px;
  box-shadow: ${p => p.theme.shadow.primary};
  ${props => !props.small && "width: 100%"};
  border: 1px solid ${p => p.theme.background.primary};
  transition: all 0.3s;

  &:hover {
    transform: scale(1.02);
    border: 1px solid ${p => p.theme.border.secondary};
  }

  ${ifProp(
    "full",
    css`
      width: 100%;
    `
  )};
`;
