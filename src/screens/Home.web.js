import React, { Component } from "react"
import AppScrollContainer from "../components/AppScrollContainer"
import Button from "../components/Button"
import Spacing from "../components/Spacing"
import styled from "styled-components"
import styles from "../utilities/styles"
import Text from "../components/Text"

export default class Home extends Component {
  render() {
    return (
      <Container>
        <Bar color={styles.colors.grey[100]}>
          <InnerContainerColumn>
            <Text tier="title">Remix</Text>
            <Spacing size={15} />
            <Text tier="thintitle">
              Join interesting groups, meet new friends, explore new places
            </Text>
            <Spacing size={25} />
            <ButtonContainer>
              <Button to="/login" title="Login" />
              <Spacing size={15} />
              <Button to="/create" title="Create New User" />
            </ButtonContainer>
          </InnerContainerColumn>
        </Bar>

        <Bar color="white">
          <InnerContainer>
            <FeatureContainer>
              <Text tier="thintitle">Group Chats</Text>
              <Spacing size={10} />
              <Text tier="largebody" color={styles.colors.grey[400]}>
                Create groups with your close friends, explore new topic-based
                groups, or find local groups.
              </Text>
            </FeatureContainer>
            <FeatureContainer>
              <Text tier="thintitle">Personal Profiles</Text>
              <Spacing size={10} />
              <Text tier="largebody" color={styles.colors.grey[400]}>
                Express yourself by decorating your profile. Add songs,
                pictures, or text to make your profile unique.
              </Text>
            </FeatureContainer>
            <FeatureContainer>
              <Text tier="thintitle">Discover Popular Content</Text>
              <Spacing size={10} />
              <Text tier="largebody" color={styles.colors.grey[400]}>
                Explore popular content based, react to messages with emojis.
                Fair algorithms, chronological order, and no ads.
              </Text>
            </FeatureContainer>
            <FeatureContainer>
              <Text tier="thintitle">Personal Groups</Text>
              <Spacing size={10} />
              <Text tier="largebody" color={styles.colors.grey[400]}>
                Groups can decorate their profiles and divide conversations into
                topic-based chats that can be made public or private.
              </Text>
            </FeatureContainer>
          </InnerContainer>
        </Bar>

        <Bar color={styles.colors.grey[200]}>
          <InnerContainerColumn>
            <Text tier="thintitle">A social network on your side</Text>
            <Spacing size={10} />
            <Text tier="largebody" color={styles.colors.grey[500]}>
              Many of today's modern social media platforms use their power in
              dubious ways, controlling what you see or don't see, optimizing
              their interface and interactions for profit-increase instead of
              user satisfaction, or selling your data to third parties.
            </Text>
          </InnerContainerColumn>
        </Bar>

        <Bar color={styles.colors.grey[100]}>
          <InnerContainerColumn>
            <Text tier="thintitle">A global graph of interesting groups</Text>
            <Spacing size={10} />
            <Text tier="largebody" color={styles.colors.grey[500]}>
              Create groups with your close friends or join interesting groups
              based on topic or location. Groups can decorate a custom profile
              and divide conversations into topic-based chats that can be made
              public or private. Public chats are searchable on a global chat
              index and can be sorted using tags
            </Text>
          </InnerContainerColumn>
        </Bar>

        <Bar color="white">
          <InnerContainerColumn>
            <Text tier="thintitle">Smart Conversations</Text>
            <Spacing size={10} />
            <Text tier="largebody" color={styles.colors.grey[500]}>
              To provide a rich social experience through chatting, we developed
              a fast communication platform that will run consistently across
              all platforms. Updates are often, support is available, and the
              code is open source - always being improved.
            </Text>
          </InnerContainerColumn>
        </Bar>

        <Bar color={styles.colors.grey[100]}>
          <InnerContainerColumn>
            <Text tier="thintitle">
              Made in Louisiana, United States{" "}
              <span role="img" aria-label="American Flag Emoji">
                🇺🇸
              </span>
            </Text>
            <Spacing size={10} />
            <Text tier="largebody" color={styles.colors.grey[500]}>
              Software produced in Baton Rouge, Louisiana by Elsea Labs. Elsea
              Labs was founded in 2012. The Remix Chat project was started in
              2017 and will enter alpha in 2018.
            </Text>
          </InnerContainerColumn>
        </Bar>
        <Spacing size={50} />
      </Container>
    )
  }
}

const Container = styled.div`
  flex: 1;
  background-color: ${styles.colors.grey[100]};
  height: 100vh;
  width: 100%;
  overflow: scroll;
  overflow-x: hidden;
  overscroll-behavior: contain;
  overscroll-behavior-y: none;
  -webkit-overflow-scrolling: touch;
`

const Bar = styled.div`
  display: flex;

  flex-direction: row;
  background-color: ${props => props.color};
  justify-content: center;
  align-items: center;
  width: 100%;
`

const InnerContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1000px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 50px 0px;
  @media (max-width: 1000px) {
    flex-direction: column;
    padding: 35px 25px;
  }
`
const InnerContainerColumn = styled.div`
  display: flex;
  width: 100%;
  max-width: 1000px;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 50px 0px;
  @media (max-width: 1000px) {
    padding: 35px 25px;
  }
`

const FeatureContainer = styled.div`
  width: 46%;
  padding-top: 20px;
  padding-bottom: 20px;
  @media (max-width: 1000px) {
    width: 100%;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 1000px) {
    flex-direction: row;
  }
`
