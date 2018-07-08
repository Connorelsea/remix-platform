import React, { Component } from "react";
import { withRouter } from "react-router";
import Button from "../elements/Button";
import TextInput from "../components/Input";
import { mutate } from "../utilities/gql_util";
import { bind } from "decko";
import ColorPicker from "../components/ColorPicker";
import Spacing from "../components/Spacing";
import styles from "../utilities/styles";
import MessageMock from "../components/MessageMock";
import Card from "../components/Card";
import FlexContainer from "../components/FlexContainer";
import FlexContainerItem from "../components/FlexContainerItem";
import { connect } from "react-redux";
import {
  setCurrentDeviceId,
  setDevices,
  addDevice,
  loginWithCurrentDevice,
} from "../ducks/auth";
import Box from "../elements/Box";
import Title from "../elements/Title";
import ScrollContainer from "../elements/ScrollContainer";
import ContentContainer from "../elements/ContentContainer";
import Subtitle from "../elements/Subtitle";
import Paragraph from "../elements/Paragraph";

class UserLogin extends Component {
  @bind
  attemptCreateUser({
    email,
    username,
    password,
    name,
    description,
    color,
    iconUrl,
  }) {
    mutate(
      `
      mutation createUser(
        $email: String
        $username: String
        $password: String
        $name: String
        $description: String
        $color: String
        $iconUrl: String
      ) {
        createUser(
          email: $email
          username: $username
          password: $password
          name: $name
          description: $description
          color: $color
          iconUrl: $iconUrl
        ) {
          id
          user {
            id
            name
            email
            username
          }
          refreshToken
          accessToken
        }
      }`,
      {
        email,
        username,
        password,
        name,
        description,
        color,
        iconUrl,
      }
    )
      .then(async res => {
        const device = res.data.createUser;

        const {
          addDevice,
          setCurrentDeviceId,
          loginWithCurrentDevice,
        } = this.props;

        addDevice(device);
        setCurrentDeviceId(device.id);
        loginWithCurrentDevice();

        this.props.history.push("/");
      })
      .catch(error => {
        this.setState({
          errors: [
            {
              key: "form",
              error:
                "There was a server side error. Review your inputs and try again",
            },
          ],
        });
        console.log(error);
      });
  }

  @bind
  onCreatePress() {
    const { color, email, username, password, name } = this.state;

    let errors = [];

    if (color === "") {
      errors.push({
        key: "color",
        error: "Choose a personal color above",
      });
    }

    if (!email) {
      errors.push({
        key: "email",
        error: "Enter your email",
      });
    } else if (
      !email.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      errors.push({
        key: "email",
        error: "Enter a valid email address",
      });
    }

    if (!username) {
      errors.push({
        key: "username",
        error: "Enter a username",
      });
    } else if (username.includes(" ")) {
      errors.push({
        key: "username",
        error: "Username cannot contain whitespace",
      });
    } else if (!username.match(/^[a-z0-9]+$/i)) {
      errors.push({
        key: "username",
        error: "Username must only contain letters and numbers",
      });
    }

    if (!name) {
      errors.push({
        key: "name",
        error: "Enter your display name",
      });
    }

    if (!password) {
      errors.push({
        key: "password",
        error: "Enter a password",
      });
    } else if (password.trim().length < 4) {
      errors.push({
        key: "password",
        error: "Enter a longer password",
      });
    }

    if (errors.length === 0) {
      this.setState({ errors: [] });
      this.attemptCreateUser(this.state);
    } else this.setState({ errors });
  }

  onTextChangeFor(name) {
    return value => this.setState({ [name]: value });
  }

  state = {
    color: "",
    messages: [],
    errors: [],
  };

  @bind
  onColorChange(color) {
    this.setState({ color });
  }

  @bind
  fieldHasError(field) {
    let errors = this.state.errors.find(e => e.key === field);
    if (!errors) return false;
    if (errors.length > 0) return true;
    return false;
  }

  render() {
    const { name, color, errors } = this.state;
    return (
      <ScrollContainer>
        <ContentContainer>
          <Box column padding="25px">
            <Title type="THIN" size="MEDIUM">
              Personal Color
            </Title>
            <Spacing size={10} />
            <Subtitle>What color are you?</Subtitle>
            <Spacing size={15} />
            <ColorPicker onColorChange={this.onColorChange} />
            <Spacing size={30} />

            <FlexContainer>
              <FlexContainerItem>
                <Title type="THIN" size="MEDIUM">
                  Your Messages
                </Title>

                <Spacing size={10} />
                <Subtitle>
                  This is what your messages will look like to other users
                </Subtitle>
                <Spacing size={15} />

                <Card>
                  <Box full column>
                    <Spacing size={5} />
                    <Box padding={{ x: 15 }}>
                      <Title type="BOLD" size="MEDIUM">
                        {name ? name : "Display Name"}
                      </Title>
                    </Box>
                    <Spacing size={10} />
                    <MessageMock
                      text={"Welcome to Remix!"}
                      color={styles.colors.grey[200]}
                    />
                    <MessageMock
                      text={`Thank you ` + (name ? `- I'm ${name}` : "")}
                      name={name}
                      color={color}
                      currentUser
                    />
                    <Spacing size={5} />
                  </Box>
                </Card>
              </FlexContainerItem>

              <Spacing size={25} />

              <FlexContainerItem>
                <Title type="THIN" size="MEDIUM">
                  Profile
                </Title>
                <Spacing size={10} />
                <Subtitle>
                  Enter some basic information to get started.
                </Subtitle>

                {errors.length > 0 && [
                  <Spacing size={15} />,
                  [errors.map(e => <Paragraph>{e.error}</Paragraph>)],
                  <Spacing size={10} />,
                  <Paragraph>Once fixed, try to join again</Paragraph>,
                ]}

                <Spacing size={15} />
                <Title
                  size="SMALL"
                  type={this.fieldHasError("email") ? "SUB" : "ERROR"}
                >
                  Email
                </Title>
                <Spacing size={5} />
                <TextInput
                  placeholder="Email"
                  onChangeText={this.onTextChangeFor("email")}
                  value={this.state.email}
                  type="email"
                />

                <Spacing size={15} />
                <Title
                  size="SMALL"
                  type={this.fieldHasError("username") ? "SUB" : "ERROR"}
                >
                  Username
                </Title>
                <Spacing size={5} />
                <TextInput
                  placeholder="Username"
                  onChangeText={this.onTextChangeFor("username")}
                  value={this.state.username}
                />

                <Spacing size={15} />
                <Title size="SMALL" type="SUB">
                  Password
                </Title>
                <Spacing size={5} />
                <TextInput
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={this.onTextChangeFor("password")}
                  value={this.state.password}
                />

                <Spacing size={15} />
                <Title size="SMALL" type="SUB">
                  Display Name
                </Title>
                <Spacing size={5} />
                <TextInput
                  placeholder="Display or Full Name"
                  onChangeText={this.onTextChangeFor("name")}
                  value={this.state.name}
                />

                <Spacing size={20} />
                <Button
                  size="MEDIUM"
                  type="EMPHASIS"
                  onClick={this.onCreatePress}
                  title="Join Remix"
                />
                <Spacing size={20} />
              </FlexContainerItem>
            </FlexContainer>

            <Spacing size={35} />
          </Box>
        </ContentContainer>
      </ScrollContainer>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addDevice: device => dispatch(addDevice(device)),
    setCurrentDeviceId: id => dispatch(setCurrentDeviceId(id)),
    loginWithCurrentDevice: id => dispatch(loginWithCurrentDevice()),
  };
}

function mapStateToProps(state, props) {
  return {
    devices: state.auth.devices,
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UserLogin)
);
