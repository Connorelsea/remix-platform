import React, { Component, type Node } from "react";
import styled, { withTheme } from "styled-components";
import Modal from "react-responsive-modal";
import ReactCrop from "react-image-crop";

import ContentContainer from "../../elements/ContentContainer";
import Box from "../../elements/Box";
import Title from "../../elements/Title";
import Spacing from "../../components/Spacing";
import Icon from "../../components/Icon";

import FeatherIcon from "react-native-vector-icons/dist/Feather";
import EditableText from "../../elements/EditableText";
import Button from "../../elements/Button";
import NewIconModal from "../../components/NewIconModal";

type Props = {};

type State = {
  name: string,
  username: string,
  description: string,
  showUploadImageModal: boolean,
};

class GroupNew extends Component<Props> {
  state = {
    showUploadImageModal: false,
    imageSrc: undefined,
  };

  render(): Node {
    const { theme } = this.props;
    const { name, username, description, showUploadImageModal } = this.state;

    return (
      <ContentContainer backgroundColor={theme.background.secondary}>
        <Box column padding="20px" fullWidth>
          <Box>
            <Box minWidth={150}>
              <Icon
                iconSize={150}
                circles={[
                  {
                    color: theme.colors.blue,
                    bottom: 1,
                    right: -5,
                    children: (
                      <FeatherIcon name="plus" size={25} color="white" />
                    ),
                    onClick: () =>
                      this.setState({ showUploadImageModal: true }),
                  },
                ]}
              />
            </Box>
            <Spacing size={40} />
            <Box fullWidth column>
              <EditableText
                placeholder="Group Name"
                editing
                themeColor="primary"
                themeFontSize="title_lg"
                fontWeight={900}
                onChange={e => {
                  this.setState({ name: e.target.value });
                }}
              >
                {name}
              </EditableText>
              <Spacing size={10} />

              <EditableText
                placeholder="ShortName"
                editing
                themeColor="tertiary"
                themeFontSize="subtitle"
                onChange={e => {
                  if (e.target.value !== "")
                    if (!e.target.value.match(/^[0-9a-z]+$/)) return;
                  this.setState({ username: e.target.value.trim() });
                }}
              >
                {username}
              </EditableText>

              <Spacing size={10} />

              <EditableText
                placeholder="Description"
                editing
                themeColor="secondary"
                themeFontSize="subtitle"
                onChange={e => {
                  this.setState({ description: e.target.value });
                }}
              >
                {description}
              </EditableText>

              <Box fullWidth justifyEnd>
                <Button
                  size="MEDIUM"
                  type="EMPHASIS"
                  title="Create Group"
                  onClick={this.updateUser}
                />
              </Box>
            </Box>
          </Box>
          <Spacing size={20} />
        </Box>

        <NewIconModal
          show={showUploadImageModal}
          onClose={() => this.setState({ showUploadImageModal: false })}
        />
      </ContentContainer>
    );
  }
}

export default withTheme(GroupNew);
