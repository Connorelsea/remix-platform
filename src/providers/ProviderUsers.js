// @flow

import React, { Component, type Node } from "react";
import { mutate } from "../utilities/gql_util";
import { bind } from "decko";
import { getUsers } from "../ducks/identity";
import { connect } from "react-redux";
type User = {
  id: string
};

type State = {
  users: Array<User>,
  usersLoading: boolean
};

type Props = {
  userIds: Array<string>,
  getUsers: (userIds: Array<string>) => Promise<Array<User>>,
  render: (props: State) => Node
};

export type ProvideUsersRenderProps = State;

const initialState: State = {
  users: [],
  usersLoading: true
};

/**
 * ProvideUsers
 *
 * Ensures that an array of user's have meta-data in the client
 * redux store. If there is a user that does not have any meta-data
 * locally, it will be requested from the server.
 */
class ProvideUsers extends Component<Props, State> {
  state: State = initialState;

  @bind
  async init() {
    const { userIds, getUsers } = this.props;
    const users = await getUsers(userIds);
    this.setState({
      users,
      usersLoading: false
    });
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
    getUsers: (userIds: Array<string>) => dispatch(getUsers(userIds))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProvideUsers);
