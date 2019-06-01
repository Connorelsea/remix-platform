// @flow

import React, { Component, type Node } from "react";
import { bind } from "decko";
import { fetchUsersById, fetchUsersByName } from "../ducks/identity/index.js";
import { connect } from "react-redux";
import { type User } from "../types/user";
import { withRouter } from "react-router-dom";

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

  componentDidUpdate(prevProps) {
    if (
      this.props.userIds !== undefined &&
      JSON.stringify(prevProps.userIds) !== JSON.stringify(this.props.userIds)
    )
      this.init();

    if (
      this.props.userNames !== undefined &&
      JSON.stringify(prevProps.userNames) !==
        JSON.stringify(this.props.userNames)
    )
      this.init();

    if (this.props.location.pathname !== prevProps.location.pathname)
      this.init();

    if (JSON.stringify(this.props.users) !== JSON.stringify(prevProps.users))
      this.init();

    console.log("PROVIDE USERS - COMP DID UPDATE");
    console.log(
      JSON.stringify(prevProps.users),
      JSON.stringify(this.props.users)
    );
    console.log("DIFFERENCE FOUND?");
    console.log(
      JSON.stringify(this.props.users) !== JSON.stringify(prevProps.users)
    );
    console.log(
      JSON.stringify(prevProps.userIds),
      JSON.stringify(this.props.userIds)
    );
  }

  constructor(props) {
    super(props);

    this.init();
  }

  @bind
  async init() {
    const {
      userIds,
      userNames,
      dispatchFetchUsersById,
      dispatchFetchUsersByName,
    } = this.props;

    console.log("PROVIDE USERS INIT");
    console.log("INPUT", userIds, userNames);

    let promises = [];
    if (userIds) promises.push(dispatchFetchUsersById(userIds));
    if (userNames) promises.push(dispatchFetchUsersByName(userNames));

    const result: Array<Array<User>> = await Promise.all(promises);

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

  render(): Node {
    const { props, state } = this;
    return props.render(state);
  }
}

function mapStateToProps(state) {
  return {
    users: state.identity.users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchFetchUsersById: (userIds: Array<string>) =>
      dispatch(fetchUsersById(userIds)),
    dispatchFetchUsersByName: (userIds: Array<string>) =>
      dispatch(fetchUsersByName(userIds)),
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProvideUsers)
);
