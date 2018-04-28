import React, { Component } from "react";
import styled from "styled-components/native";
import colors from "../utilities/colors";
import { Motion, spring } from "react-motion";

export default class Logo extends Component {
  state = {
    multiplier: 0
  };

  componentDidMount() {
    // setTimeout(() => this.setState({ multiplier: spring(5) }), 600)
    // setTimeout(() => this.setState({ multiplier: spring(0) }), 1600)
  }

  render() {
    const { multiplier } = this.state;
    let colorsRealBlack = [
      "black", // black
      "#751489", // purple
      "#0C158D", // navy
      "#2B1ECE", // deep blue
      "#0F72E0", // bright blue
      "#85BFFF", // light blue
      "#65E196", // neon green
      "#36954B", // green
      "#FFC000", // yellow
      "#F9CAA8", // sandstone
      "#B42525", // red
      "#FF8383", // salmon
      "#FFCACA", // light pink
      "#D1D5DB" // grey
    ];

    return (
      <Container>
        <Motion
          defaultStyle={{ multiplier: 0 }}
          style={{ multiplier: multiplier }}
        >
          {value => (
            <RainbowContainer>
              {multiplier === 0 ? (
                <Text>Remix</Text>
              ) : (
                [
                  ...colorsRealBlack.map((c, i) => (
                    <RText color={c} i={i} multiplier={value.multiplier}>
                      R
                    </RText>
                  )),
                  <RText
                    color="black"
                    i={colorsRealBlack.length + 6}
                    multiplier={Math.max(value.multiplier, 1.75)}
                  >
                    emix
                  </RText>
                ]
              )}
            </RainbowContainer>
          )}
        </Motion>
      </Container>
    );
  }
}

const Container = styled.View``;

const RainbowContainer = styled.View`
  /* position: relative; */
  height: 50px;
`;

const Text = styled.Text`
  font-size: 50px;
  font-weight: 900;
`;

const RText = styled.Text`
  font-size: 50px;
  font-weight: 900;
  color: ${props => props.color};
  position: absolute;
  left: ${props => props.i * props.multiplier}px;
  z-index: ${props => -props.i};
`;
