import styled from "styled-components"

export default styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 999px) {
    flex-direction: column;
  }
`
