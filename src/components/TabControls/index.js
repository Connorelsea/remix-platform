import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import Box from "../../elements/Box.web";
import Button from "../../elements/Button";

import FeatherIcon from "react-native-vector-icons/dist/Feather";
import { withTheme } from "styled-components";
import { type Theme } from "../../utilities/theme";
import Spacing from "../Spacing";
import { createNewTab } from "../../ducks/tabs";

type Props = {
  theme: Theme,
  createNewTab: (
    url: string,
    title?: string,
    subtitle?: string,
    iconUrl?: string
  ) => Promise<any>,
};

type State = {};

class TabControls extends Component<Props, State> {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.tabs.toString() !== nextProps.tabs.toString()) return true;
    return false;
  }
  render(): Node {
    const { theme, createNewTab } = this.props;

    return (
      <Box justifyEnd>
        <Button
          title=""
          size="SMALL"
          type="DEFAULT"
          icon={
            <FeatherIcon
              name="home"
              size={22}
              color={theme.button.default.text}
            />
          }
          to="/"
        />
        <Spacing size={10} />
        <Button
          title=""
          size="SMALL"
          type="DEFAULT"
          icon={
            <FeatherIcon
              name="layers"
              size={22}
              color={theme.button.default.text}
            />
          }
          onClick={() => createNewTab("/tabs/all", "All Tabs")}
        />
        <Spacing size={10} />
        <Button
          title=""
          size="SMALL"
          type="DEFAULT"
          icon={
            <FeatherIcon
              name="plus"
              size={22}
              color={theme.button.default.text}
            />
          }
          onClick={() => createNewTab("/tabs/new", "New Tab")}
        />
      </Box>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    tabs: state.tabs.tabs,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createNewTab: (
      url: string,
      title?: string,
      subtitle?: string,
      iconUrl?: string
    ) => dispatch(createNewTab(url, title, subtitle, iconUrl)),
  };
}

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(TabControls)
);
