// @flow

import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { bind } from "decko";
import { type Tab as TabType } from "../../types/tab";
import { createTab, replaceAllTabs } from "../../ducks/tabs";
import Tab from "../Tab";
import Button from "../../elements/Button";
import Box from "../../elements/Box";
import SpacingComponent from "../Spacing";
import styled, { withTheme } from "styled-components";
import { type Theme } from "../../utilities/theme";

import Icon from "react-native-vector-icons/dist/Feather";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DroppableProvided,
  type DroppableStateSnapshot,
} from "react-beautiful-dnd";

type Props = {
  theme: Theme,
  tabs: Array<TabType>,
  dispatchReplaceAllTabs: (tabs: Array<Tab>) => Promise<any>,
};

class TabBar extends Component<Props> {
  @bind
  getListStyle(isDraggingOver) {
    const { theme } = this.props;
    return {
      background: isDraggingOver ? "lightblue" : theme.background.secondary,
      display: "flex",
      overflow: "auto",
      width: "100%",
    };
  }

  @bind
  renderDroppableBody(
    provided: DroppableProvided,
    snapshot: DroppableStateSnapshot
  ) {
    // BEFORE, TabContainer held the tabs
    const { tabs } = this.props;

    return (
      <Box
        innerRef={provided.innerRef}
        style={this.getListStyle(snapshot.isDraggingOver)}
        {...provided.droppableProps}
      >
        {tabs.map((tab, i) => <Tab tab={tab} index={i} key={tab.id} />)}
      </Box>
    );
  }

  render(): Node {
    const { tabs, theme } = this.props;

    return (
      <Box fullWidth row backgroundColor={theme.background.secondary} alignEnd>
        <SpacingComponent size={10} />
        <Box column>
          <SpacingComponent size={10} />
          <Box>
            <Button
              title=""
              size="SMALL"
              type="DEFAULT"
              icon={
                <Icon
                  name="layers"
                  size={22}
                  color={theme.button.default.text}
                />
              }
            />
            <SpacingComponent size={10} />
            <Button
              title=""
              size="SMALL"
              type="DEFAULT"
              icon={
                <Icon name="plus" size={22} color={theme.button.default.text} />
              }
            />
          </Box>
          <SpacingComponent size={10} />
        </Box>
        <SpacingComponent size={10} />
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {this.renderDroppableBody}
          </Droppable>
        </DragDropContext>
      </Box>
    );
  }

  @bind
  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const sortedTabs = this.reorder(
      this.props.tabs,
      result.source.index,
      result.destination.index
    );

    // DISPATCH action to re-order tabs. Aka replace old array
    this.props.dispatchReplaceAllTabs(sortedTabs);
  }

  reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }
}

const TabContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;

  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;

  /* &::-webkit-scrollbar {
    display: none;
  } */
`;

function mapStateToProps(state, props) {
  return {
    tabs: state.tabs.tabs,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchCreateTab: (tab: TabType) => dispatch(createTab(tab)),
    dispatchReplaceAllTabs: (tabs: Array<Tab>) =>
      dispatch(replaceAllTabs(tabs)),
  };
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(TabBar));
