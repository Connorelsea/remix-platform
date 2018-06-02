import styled from "styled-components";

export default styled.div`
  background-color: ${p => p.theme.background.primary};
  padding: 14px 15px;
  border-radius: 8px;
  box-shadow: 0px 7px 13px -4px #d5d9db;
  ${props => !props.small && "width: 100%"};
`;
