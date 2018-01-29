import React from "react"
import User from "../ducks/user"
import { connect } from "react-redux"

class DataManager extends React.Component {
  componentDidMount() {}

  fetchInitialData() {
    console.log(this.props)
    const {
      user: { id },
      loadInitialUser,
      subscribeToFriendRequests,
      subscribeToMessages,
    } = this.props

    loadInitialUser(id)
    subscribeToFriendRequests(id)
    subscribeToMessages(id)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading && !nextProps.loading) {
    }
  }

  render() {
    return this.props.children
  }
}

function mapDispatchToProps(dispatch) {
  return {
    subscribeToFriendRequests: id => {
      dispatch(User.creators.subscribeToFriendRequests(id))
    },
    subscribeToMessages: id => {
      dispatch(User.creators.subscribeToMessages(id))
    },
    loadInitialUser: id => dispatch(User.creators.loadInitialUser(id)),
    removeFriendRequest: id => dispatch(User.creators.removeFriendRequest(id)),
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    loading: state.user.loading,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataManager)
