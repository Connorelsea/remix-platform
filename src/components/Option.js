import React, { Component } from "react";
import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";

export default class Option extends Component {
  render() {
    const { options } = this.props;

    return (
      <Container>
        {options.map(option => (
          <TouchableOpacity onPress={option.action}>
            <Text color={option.color}>{option.text}</Text>
          </TouchableOpacity>
        ))}
      </Container>
    );
  }
}

const Container = styled.View`
  align-items: center;
  justify-content: space-between;
  height: 40px;
`;

const Text = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.color};
`;
