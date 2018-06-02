// @flow

import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { bind } from "decko";
import Button from "../../elements/Button";
import TouchableArea from "../../elements/TouchableArea";
import { type Tab as TabType } from "../../types/tab";
import { setCurrentTab } from "../../ducks/tabs";
import styled from "styled-components";
import Subtitle from "../../elements/Subtitle";
import Paragraph from "../../elements/Paragraph";

import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from "react-beautiful-dnd";

type Props = {
  tab: TabType,
  index: number,
  setCurrentTab: (tab: TabType) => Promise<any>,
};

class Tab extends Component<Props> {
  @bind
  onPress() {
    const { tab, setCurrentTab } = this.props;
    if (tab.id) setCurrentTab(tab);
  }

  grid: number = 8;

  getTabStyle(isDragging, draggableStyle) {
    return {
      // some basic styles to make the items look a bit nicer
      userSelect: "none",
      boxShadow: "0px 7px 13px -4px #D5D9DB",

      // change background colour if dragging
      // background: isDragging ? "lightgreen" : "grey",

      // styles we need to apply on draggables
      ...draggableStyle,
    };
  }

  @bind
  renderDraggableBody(
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ): Node {
    const { tab } = this.props;
    const { onPress } = this;

    return (
      <TouchableArea
        onPress={onPress}
        innerRef={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={this.getTabStyle(
          snapshot.isDragging,
          provided.draggableProps.style
        )}
      >
        <Body>
          <Paragraph>{tab.title}</Paragraph>
        </Body>
      </TouchableArea>
    );
  }

  render(): Node {
    const { tab } = this.props;

    // TODO: May need key and index on Draggable?

    return (
      <Outer>
        <Draggable draggableId={tab.id}>{this.renderDraggableBody}</Draggable>
      </Outer>
    );
  }
}

const Outer = styled.div`
  flex: 0 0 auto;
`;

const Body = styled.div`
  border: 1px solid ${p => p.theme.border.primary};
  background-color: ${p => p.theme.background.primary};
  padding: 10px;
  border-radius: 10px 10px 0 0;
`;

function mapStateToProps(state, props) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentTab: (id: string) => dispatch(setCurrentTab(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tab);
