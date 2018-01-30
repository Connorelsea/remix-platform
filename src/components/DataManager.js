import React from "react"
import User from "../ducks/user"
import { connect } from "react-redux"
import { bind } from "decko"
import { get } from "../utilities/storage"

class DataManager extends React.Component {
  componentDidMount() {
    this.fetchInitialData()
  }

  @bind
  async fetchInitialData() {
    const { loadInitialUser } = this.props
    let userId = await get("userId")
    if (userId) {
      loadInitialUser(userId)
      // this.initSubscriptions()
    }
  }

  initSubscriptions() {
    const {
      user: { id },
      subscribeToFriendRequests,
      subscribeToMessages,
    } = this.props

    subscribeToFriendRequests(id)
    subscribeToMessages(id)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading && !nextProps.loading) {
      this.initSubscriptions()
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
