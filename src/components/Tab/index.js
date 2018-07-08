// @flow

import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { bind } from "decko";
import Button from "../../elements/Button";
import TouchableArea from "../../elements/TouchableArea";
import { type Tab as TabType } from "../../types/tab";
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

import FeatherIcon from "react-native-vector-icons/dist/Feather";

type Props = {
  tab: TabType,
  index: number,
  theme: Theme,
  currentTabId: string,
};

class Tab extends Component<Props> {
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
    const { tab, index } = this.props;

    return (
      <Draggable index={index} draggableId={tab.id}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
          const { tab, theme, currentTabId } = this.props;

          return (
            <Link
              to={tab.url}
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
                <Box column justifyCenter>
                  <Paragraph color={theme.text.primary}>{tab.title}</Paragraph>
                  {tab.subtitle !== undefined && (
                    <Paragraph>{tab.subtitle}</Paragraph>
                  )}
                </Box>
              </Body>
            </Link>
          );
        }}
      </Draggable>
    );
  }
}

const Body = styled.div`
  border: 1px solid ${p => p.theme.border.secondary};
  border-bottom: none;
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

  transition: all 0.3s;

  &:hover {
    transform: translateY(3px);
  }
`;

function mapStateToProps(state, props) {
  return {
    currentTabId: state.tabs.currentTabId,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Tab));
