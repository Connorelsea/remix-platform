import React, { Component, type Node } from "react";
import AppScrollContainer from "../components/AppScrollContainer";
import styled from "styled-components";
import Subtitle from "../elements/Subtitle";

type Props = {};

class Dashboard extends Component<Props> {
  render(): Node {
    return (
      <AppScrollContainer title="Remix">
        <Subtitle>Notifications</Subtitle>
        <div>Hello World Dashboard</div>
        <Subtitle>Online Friends</Subtitle>
        <Subtitle>Recent Messages</Subtitle>
      </AppScrollContainer>
    );
  }
}

export default Dashboard;
