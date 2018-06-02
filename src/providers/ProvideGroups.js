// @flow

import React, { Component, type Node } from "react";
import { bind } from "decko";
import { fetchGroupsById, fetchGroupsByName } from "../ducks/groups/index.js";
import { connect } from "react-redux";
import { type Group } from "../types/group";

type State = {
  groups: Array<Group>,
  groupsLoading: boolean,
};

/**
 * Either userIds or userNames can be provided, and metadata will be
 * retrieved about the users who match these unique identifiers
 */

type Props = {
  groupIds: Array<string>,
  groupNames: Array<string>,
  render: (props: State) => Node,

  dispatchFetchGroupsById: (userIds: Array<string>) => Promise<Array<Group>>,
  dispatchFetchGroupsByName: (
    userNames: Array<string>
  ) => Promise<Array<Group>>,
};

export type ProvideGroupsRenderProps = State;

const initialState: State = {
  groups: [],
  groupsLoading: true,
};

/**
 * ProvideUsers
 *
 * Given an array of unique identifiers representing remix groups,
 * this component ensures that these groups' metadata will be available
 * on the client. If a user's metadata is not already on the client,
 * it will be fetched from the server. Read more about these techniques
 * in the identity reducer.
 */
class ProvideGroups extends Component<Props, State> {
  state: State = initialState;

  @bind
  async init() {
    const {
      groupIds,
      groupNames,
      dispatchFetchGroupsById,
      dispatchFetchGroupsByName,
    } = this.props;

    let promises = [];
    if (groupIds) promises.push(dispatchFetchGroupsById(groupIds));
    if (groupNames) promises.push(dispatchFetchGroupsByName(groupNames));

    const result: Array<Array<Group>> = await Promise.all(promises);

    console.log("PROVIDE GROUPS RESULT", result);

    const groups: Array<Group> = result.reduce(
      (prev, next) => prev.concat(next),
      []
    );

    this.setState({
      groups,
      groupsLoading: false,
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
    dispatchFetchGroupsById: (groupIds: Array<string>) =>
      dispatch(fetchGroupsById(groupIds)),
    dispatchFetchGroupsByName: (groupNames: Array<string>) =>
      dispatch(fetchGroupsByName(groupNames)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProvideGroups);
