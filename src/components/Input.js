import React, { Component } from "react"
import styled from "styled-components/native"
import styles from "../utilities/styles"

export default class Input extends Component {
  render() {
    const {
      onChangeText,
      value,
      placeholder,
      onSubmitEditing,
      innerRef,
    } = this.props

    return (
      <StyledInput
        placeholder={placeholder}
        placeholderTextColor={styles.colors.grey[200]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        innerRef={innerRef}
      />
    )
  }
}

const StyledInput = styled.TextInput`
  border: 1px solid ${styles.colors.grey[200]};
  border-radius: 100px;
  margin: 0px;
  padding: 15px 20px;
  font-size: 16px;
  background-color: white;
  flex: 1;
`
