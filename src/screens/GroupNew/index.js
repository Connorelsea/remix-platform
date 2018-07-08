import React, { Component, type Node } from "react";
import ContentContainer from "../../elements/ContentContainer";
import Box from "../../elements/Box";
import Spacing from "../../components/Spacing";
import Title from "../../elements/Title";
import { withTheme } from "styled-components";
import styled from "styled-components";

type Props = {};

type State = {
  name: string,
  description: string,
};

class GroupNew extends Component<Props> {
  state = {
    name: undefined,
    description: undefined,
  };

  render(): Node {
    const { theme } = this.props;
    const { name, description } = this.state;

    return (
      <ContentContainer backgroundColor={theme.background.secondary}>
        <Box column padding="20px" fullWidth>
          <Spacing size={40} />
          <Box column>
            <NameInput
              type="text"
              placeholder="Group Name"
              value={name}
              onChange={e => this.setState({ name: e.target.value })}
            />
            <DescriptionInput
              type="text"
              placeholder="Write your group's description"
              value={description}
              onChange={e => this.setState({ description: e.target.value })}
            />
          </Box>
          <Spacing size={20} />
        </Box>
      </ContentContainer>
    );
  }
}

const NameInput = styled.input`
  border: 0;
  background-color: transparent;
  font-size: 30px;
  font-weight: 800;
  outline: 0;

  &:focus {
    text-decoration: underline;
  }
`;

const DescriptionInput = styled.input`
  border: 0;
  background-color: transparent;
  font-size: 20px;
  font-weight: 500;
  outline: 0;

  &:focus {
    text-decoration: underline;
  }
`;

export default withTheme(GroupNew);
