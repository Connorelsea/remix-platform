import styled from "styled-components";

export default styled.h2`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  color: ${p => p.theme.text.tertiary};
  font-size: ${p => p.theme.fontSize.subtitle}px;
  font-weight: 500;
  letter-spacing: -0.3px;
  margin: 0;

  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
`;
