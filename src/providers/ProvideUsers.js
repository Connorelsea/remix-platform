// @flow

import React, { Component, type Node } from "react";
import { bind } from "decko";
import { fetchUsersById, fetchUsersByName } from "../ducks/identity/index.js";
import { connect } from "react-redux";
import { type User } from "../types/user";

type State = {
  users: Array<User>,
  usersLoading: boolean,
};

/**
 * Either userIds or userNames can be provided, and metadata will be
 * retrieved about the users who match these unique identifiers
 */

type Props = {
  userIds: Array<string>,
  userNames: Array<string>,
  render: (props: State) => Node,

  dispatchFetchUsersById: (userIds: Array<string>) => Promise<Array<User>>,
  dispatchFetchUsersByName: (userNames: Array<string>) => Promise<Array<User>>,
};

export type ProvideUsersRenderProps = State;

const initialState: State = {
  users: [],
  usersLoading: true,
};

/**
 * ProvideUsers
 *
 * Given an array of unique identifiers representing remix users,
 * this component ensures that these users' metadata will be available
 * on the client. If a user's metadata is not already on the client,
 * it will be fetched from the server. Read more about these techniques
 * in the identity reducer.
 */
class ProvideUsers extends Component<Props, State> {
  state: State = initialState;

  @bind
  async init() {
    const {
      userIds,
      userNames,
      dispatchFetchUsersById,
      dispatchFetchUsersByName,
    } = this.props;

    let promises = [];
    if (userIds) promises.push(dispatchFetchUsersById(userIds));
    if (userNames) promises.push(dispatchFetchUsersByName(userNames));

    const result: Array<Array<User>> = await Promise.all(promises);

    console.log("INPUT", userIds, userNames);

    console.log("PROVIDE USERS RESULT", result);

    const users: Array<User> = result.reduce(
      (prev, next) => prev.concat(next),
      []
    );

    console.log("PROVIDE USERS RESULT", users);

    this.setState({
      users,
      usersLoading: false,
    });

    console.log("AFTRER SET STATE IN PROVIDE USERS", this.state);
  }

  componentDidMount() {
    this.init();
  }

  render(): Node {
    const { props, state } = this;
    return props.render(state);
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchFetchUsersById: (userIds: Array<string>) =>
      dispatch(fetchUsersById(userIds)),
    dispatchFetchUsersByName: (userIds: Array<string>) =>
      dispatch(fetchUsersByName(userIds)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProvideUsers);
