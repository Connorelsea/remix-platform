import React, { Component, type Node } from "react";
import { type Chat } from "../../types/chat";
import Subtitle from "../../elements/Subtitle";
import Title from "../../elements/Title";
import Spacing from "../../components/Spacing";
import { type Group } from "../../types/group";
import CardLink from "../../elements/CardLink";
import { buildChatLink } from "../../utilities/urls";

type Props = {
  chat: Chat,
  group: Group,
  theme: Theme,
};

class ChatCard extends Component<Props> {
  render(): Node {
    const { group, chat } = this.props;

    return (
      <CardLink to={buildChatLink(group, chat)}>
        <Title type="BOLD" size="MEDIUM">
          {chat.name}
        </Title>
        <Spacing size={5} />
        <Subtitle>{chat.description}</Subtitle>
      </CardLink>
    );
  }
}

export default ChatCard;
