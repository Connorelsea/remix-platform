import React, { Component, type Node } from "react";

import IconCamera from "../assets/icons/camera.svg";
import IconFolder from "../assets/icons/folder.svg";
import IconMedia from "../assets/icons/media.svg";
import IconNetwork from "../assets/icons/network.svg";
import IconNewGroup from "../assets/icons/newGroup.svg";
import IconNote from "../assets/icons/note.svg";
import IconSettings from "../assets/icons/settings.svg";
import IconStickers from "../assets/icons/stickers.svg";

import Box from "../elements/Box";
import QuickIcon from "./QuickIcon";
import styled from "styled-components";

type Props = {};

class QuickIcons extends Component<Props> {
  render(): Node {
    return (
      <IconContainer>
        <QuickIcon icon={IconFolder} label="Storage" to="/storage" />
        <QuickIcon icon={IconNote} label="Notes" to="/storage/notes" />
        <QuickIcon icon={IconMedia} label="Media" to="/storage/media" />
        <QuickIcon icon={IconCamera} label="Camera" to="/camera" />
        <QuickIcon icon={IconSettings} label="Settings" to="/settings" />
        <QuickIcon icon={IconNetwork} label="Group Network" to="/network" />
        <QuickIcon icon={IconStickers} label="Stickers" to="/stickers" />
        <QuickIcon icon={IconNewGroup} label="New Group" to="/g/new" />
      </IconContainer>
    );
  }
}

const IconContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 460px;
`;

export default QuickIcons;
