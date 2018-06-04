import styled from "styled-components";

export default styled.div`
  background-color: ${p => p.theme.background.primary};
  padding: 14px 15px;
  border-radius: 8px;
  box-shadow: ${p => p.theme.shadow.primary};
  ${props => !props.small && "width: 100%"};
`;
