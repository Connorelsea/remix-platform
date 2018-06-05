import styled from "styled-components";

export default styled.div`
  background-color: ${p => p.theme.background.primary};
  padding: 15px;
  border-radius: 8px;
  box-shadow: ${p => p.theme.shadow.primary};
  ${props => !props.small && "width: 100%"};
  border: 1px solid ${p => p.theme.background.primary};
  transition: all 0.3s;

  &:hover {
    transform: scale(1.03);
    border: 1px solid ${p => p.theme.border.secondary};
  }
`;
