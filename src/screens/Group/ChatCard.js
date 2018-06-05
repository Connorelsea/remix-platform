import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { type Chat } from "../../types/chat";
import { withTheme } from "styled-components";
import Box from "../../elements/Box";
import Subtitle from "../../elements/Subtitle";
import Title from "../../elements/Title";
import Spacing from "../../components/Spacing";
import Card from "../../elements/Card";
import { updateTabByUrl } from "../../ducks/tabs";
import { type Tab } from "../../types/tab";
import { type Group } from "../../types/group";
import { bind } from "decko";

type Props = {
  chat: Chat,
  group: Group,
  theme: Theme,
};

type State = {};

class ChatCard extends Component<Props, State> {
  @bind
  onClick() {
    // replace old group tab with new url that has clicked chat name
    // /g/+group/#chat
    const { group, chat, updateTabByUrl } = this.props;

    updateTabByUrl(
      `/g/+${group.username}`,
      `/g/+${group.username}/${chat.name}`,
      `/g/+${group.username}`,
      `#chat`
    );
  }

  render(): Node {
    const { chat, theme } = this.props;

    return (
      <Card onClick={this.onClick}>
        <Title type="BOLD" size="LARGE">
          {chat.name}
        </Title>
        <Spacing size={10} />
        <Subtitle>{chat.description}</Subtitle>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    updateTabByUrl: (tabUrl, url, title, subtitle, iconUrl) =>
      dispatch(updateTabByUrl(tabUrl, url, title, subtitle, iconUrl)),
  };
}

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(ChatCard)
);
