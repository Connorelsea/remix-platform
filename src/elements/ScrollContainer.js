import styled from "styled-components";

const ScrollContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: none;

  flex-grow: 1;
  flex-shrink: 1;

  -ms-overflow-style: -ms-autohiding-scrollbar;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  transform: translateZ(0);
`;

export default ScrollContainer;
