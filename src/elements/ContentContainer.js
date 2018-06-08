import styled from "styled-components";

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${p => p.backgroundColor || p.theme.background.secondary};
  min-height: 100%;
  width: 100%;
`;

export default ContentContainer;
