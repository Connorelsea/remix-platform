import React, { Component } from "react"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"

import AppScrollContainer from "../components/AppScrollContainer"
import { query } from "../utilities/gql_util"
import { client } from "../utilities/apollo"
import styles from "../utilities/styles"

const Route = Routing.Route
const Link = Routing.Link

const tiers = {
  title: {
    size: 30,
    weight: 900,
    spacing: -0.5,
    color: styles.colors.grey[600],
  },
  subtitle: {
    size: 16,
    weight: 500,
    spacing: 0,
    color: styles.colors.grey[400],
  },
  body: {
    size: 16,
    weight: 500,
    spacing: 0,
    color: styles.colors.grey[600],
  },
  emphasis: {
    size: 17,
    weight: 400,
    spacing: 0,
    color: styles.colors.grey[500],
  },
  emphasisSubtitle: {
    size: 15,
    weight: 300,
    // TODO
  },
  requestTitle: {
    size: 16,
    weight: 700,
    spacing: -0.3,
  },
  requestSubtitle: {
    size: 13,
    color: "rgba(0,0,0,0.5)",
  },
  messageName: {
    size: 15,
    weight: 600,
    spacing: 0,
    color: styles.colors.grey[400],
  },
}

export default styled.Text`
  font-size: ${({ tier, small }) => tiers[tier].size - (small ? 2 : 0)}px;
  font-weight: ${({ tier }) => tiers[tier].weight || 500};
  letter-spacing: ${({ tier }) => tiers[tier].spacing || 0};
  color: ${({ tier, color }) => color || tiers[tier].color || "black"};
  margin: 0;
  padding: 0;
  ${({ center }) => center && "text-align: center"};
`
