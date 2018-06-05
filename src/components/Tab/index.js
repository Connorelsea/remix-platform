// @flow

import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { bind } from "decko";
import Button from "../../elements/Button";
import TouchableArea from "../../elements/TouchableArea";
import { type Tab as TabType } from "../../types/tab";
import { setCurrentTab } from "../../ducks/tabs";
import styled, { withTheme } from "styled-components";
import Subtitle from "../../elements/Subtitle";
import Paragraph from "../../elements/Paragraph";

import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { type Theme } from "../../utilities/theme";
import Box from "../../elements/Box.web";
import Icon from "../Icon/index";
import Spacing from "../Spacing";

import tinycolor from "tinycolor2";

type Props = {
  tab: TabType,
  index: number,
  setCurrentTab: (tab: TabType) => Promise<any>,
  theme: Theme,
  currentTabId: string,
};

class Tab extends Component<Props> {
  @bind
  onPress() {
    const { tab, setCurrentTab } = this.props;
    if (tab.id) setCurrentTab(tab);
  }

  grid: number = 8;

  @bind
  getTabStyle(isDragging, draggableStyle) {
    return {
      // some basic styles to make the items look a bit nicer
      userSelect: "none",
      boxShadow: isDragging ? this.props.theme.shadow.secondary : undefined,

      // change background colour if dragging
      // background: isDragging ? "lightgreen" : "grey",

      // styles we need to apply on draggables
      ...draggableStyle,
    };
  }

  render(): Node {
    const { tab } = this.props;

    // TODO: May need key and index on Draggable?

    return (
      <Outer>
        <Draggable draggableId={tab.id}>
          {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
            const { tab, theme, currentTabId } = this.props;
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
                <Body justifyAround isCurrentTab={currentTabId === tab.id}>
                  {tab.iconUrl !== undefined && [
                    <Icon iconSize={45} iconUrl={tab.iconUrl} />,
                    <Spacing size={10} />,
                  ]}
                  <Box column fullHeight justifyCenter>
                    <Paragraph color={theme.text.primary}>
                      {tab.title}
                    </Paragraph>
                    {tab.subtitle !== undefined && (
                      <Paragraph>{tab.subtitle}</Paragraph>
                    )}
                  </Box>
                </Body>
              </TouchableArea>
            );
          }}
        </Draggable>
      </Outer>
    );
  }
}

const Outer = styled.div`
  flex: 0 0 auto;
`;

const Body = styled.div`
  border: 1px solid ${p => p.theme.border.secondary};
  border-bottom: ${p =>
    p.isCurrentTab
      ? `1px solid ${p.theme.background.primary}`
      : `1px solid ${p.theme.border.secondary}`};
  background-color: ${p =>
    p.isCurrentTab
      ? p.theme.background.primary
      : tinycolor(p.theme.background.primary)
          .darken(5)
          .toString()};
  padding: 10px;
  border-radius: 10px 10px 0 0;
  height: 65px;
  min-height: 65px;

  display: flex;
  flex-direction: row;
  align-items: center;
`;

function mapStateToProps(state, props) {
  return {
    currentTabId: state.tabs.currentTabId,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentTab: (id: string) => dispatch(setCurrentTab(id)),
  };
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Tab));
