import React, { Component } from "react";
import styled from "styled-components";
import Header from "./Header";
import styles from "../utilities/styles";
import Spacing from "./Spacing";
import { bind } from "decko";
import TabBar from "../components/TabBar";
import { Theme } from "../utilities/theme";

export default class AppScrollContainer extends Component {
  state = {
    largeHeader: true,
  };

  @bind
  onScroll(event) {
    const scrollTop = event.currentTarget.scrollTop;
    const { largeHeader } = this.state;

    if (scrollTop > 10 && largeHeader === true)
      this.setState({ largeHeader: false });
    if (scrollTop < 10 && largeHeader === false)
      this.setState({ largeHeader: true });
  }

  render() {
    const { user, fullwidth = false, title, backText, children } = this.props;
    const { largeHeader } = this.state;

    return (
      <Container id="scroll" onScroll={this.onScroll}>
        <Header
          user={user}
          backText={backText || "Back"}
          title={title || "Remix"}
          large={largeHeader}
        />
        <Spacing size={120} />
        <Scroll fullwidth={fullwidth}>
          <InnerScroll>{children}</InnerScroll>
        </Scroll>
        <TabBar />
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: ${p => p.theme.background.secondary};
  height: 100%;
  width: 100%;
`;

const InnerScroll = styled.div`
  /* padding: 25px; */
  width: 100%;
  /* display: flex; */
  /* flex-direction: column; */
  /* flex: 1; */
  /* @media (min-width: 999px) {
    padding: 20px;
  } */
  overflow: auto;
  overflow-x: hidden;
`;

const Scroll = styled.div`
  width: 100%;
  max-width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  /* flex: 1; */
  align-self: center;

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 20px;
  }

  ::-webkit-scrollbar-track {
    background: #f8f8f8;
    border-radius: 20px;
  }
`;
