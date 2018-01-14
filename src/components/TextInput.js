import React from "react"
import styled from "styled-components/native"

const Input = ({
  placeholder,
  onChangeText,
  value,
  secureTextEntry = false,
}) => (
  <TextInput
    secureTextEntry={secureTextEntry}
    placeholder={placeholder || "Start typing..."}
    onChangeText={onChangeText}
    value={value}
  />
)

export default Input

const TextInput = styled.TextInput`
  font-size: 17px;
  padding: 20px 0px;
`
