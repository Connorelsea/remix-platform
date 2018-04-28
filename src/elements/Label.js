// @flow

import React, { Component, type Node } from "react";
import styled from "styled-components";

export default styled.p`
  margin: 4px 10px;
  font-size: ${p => p.theme.fontSize.label}px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${p => p.theme.text.tertiary};
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
`;
