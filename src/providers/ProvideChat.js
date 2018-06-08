import React, { Component, type Node } from "react";
import { withRouter } from "react-router-dom";
import ProvideGroups, { type ProvideGroupsRenderProps } from "./ProvideGroups";

type Props = {};

type State = {};

class ProvideChat extends Component<Props, State> {
  render(): Node {
    const { match } = this.props;
    const params = match.params;

    return (
      <ProvideGroups
        groupNames={[params.username]}
        render={(props: ProvideGroupsRenderProps) => {
          const { groups, groupsLoading } = props;

          if (groupsLoading) return <div>Loading</div>;

          const group: Group = groups[0];

          return this.props.render({
            group,
            chat: group.chats.find(c => c.name === params.chat),
          });
        }}
      />
    );
  }
}

export default withRouter(ProvideChat);
