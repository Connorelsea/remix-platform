import Duck from "extensible-duck"
import { client } from "../utilities/apollo"
import gql from "graphql-tag"
import { query } from "../utilities/gql_util"
import createCachedSelector from "re-reselect"
import initialUserQuery from "./user.graphql"
import { remove } from "../utilities/storage"

// ACTION CREATORS

// USER

// You can serialize this state to some kind of local store
// and then re-load it on application start. Then trigger a
// fetching of new data that will replace this old data if
// needed, then saving a new copy of the state to the local
// store. This will also help allow this app to not crash
// going offline

export default new Duck({
  namespace: "remix",
  store: "user",
  types: [
    "ADD_FRIEND_REQUEST",
    "ADD_FRIEND_REQUESTS",
    "SET_FRIEND_REQUESTS",
    "REMOVE_FRIEND_REQUEST",
    "ADD_GROUPS",
    "SET_GROUPS",
    "ADD_MESSAGES",
    "SET_MESSAGES",
    "ADD_FRIENDS",
    "SET_USERS",
    "SET_USER_META",
    "START_USER_LOADING",
    "END_USER_LOADING",
    "LOGOUT",
    "ADD_READ_POSITION",
  ],
  initialState: {
    id: undefined,
    friendRequests: [],
    friends: [],
    groups: [],
    messages: [],
    users: [],
    loading: false,
    readPositions: [],
  },
  reducer: (state, action, duck) => {
    switch (action.type) {
      case duck.types.SET_USER_META: {
        const { id } = action.payload
        return {
          ...state,
          id,
        }
      }

      case duck.types.ADD_FRIEND_REQUEST: {
        const { friendRequest } = action
        return {
          ...state,
          friendRequests: [...state.friendRequests, friendRequest],
        }
      }

      case duck.types.ADD_FRIEND_REQUESTS: {
        const { requests } = action
        return {
          ...state,
          friendRequests: [...state.friendRequests, ...requests],
        }
      }

      case duck.types.SET_FRIEND_REQUESTS: {
        const { requests } = action
        return { ...state, friendRequests: requests }
      }

      case duck.types.REMOVE_FRIEND_REQUEST: {
        const { id } = action
        const friendRequests = state.friendRequests.filter(req => req.id !== id)
        return { ...state, friendRequests }
      }

      case duck.types.ADD_GROUPS: {
        const { groups } = action
        return { ...state, groups: [...state.groups, ...groups] }
      }

      case duck.types.SET_GROUPS: {
        const { groups } = action
        return { ...state, groups }
      }

      case duck.types.ADD_MESSAGES: {
        const { messages } = action
        console.log("ADD MESSAGES", messages)
        return { ...state, messages: [...state.messages, ...messages] }
      }

      case duck.types.SET_MESSAGES: {
        const { messages } = action
        return { ...state, messages }
      }

      case duck.types.SET_USERS: {
        const { users } = action
        return { ...state, users }
      }

      case duck.types.START_USER_LOADING: {
        return { ...state, loading: true }
      }

      case duck.types.END_USER_LOADING: {
        return { ...state, loading: false }
      }

      case duck.types.LOGOUT: {
        remove("token")
        remove("userId")
        return duck.initialState
      }

      case duck.types.ADD_READ_POSITION: {
        const { payload } = action
        // If x user for y chat already had a previous RP
        // remove it then add the new one
        const newReadPositions = state.readPositions.filter(
          rp => !(rp.chatId === payload.chatId && rp.userId === payload.userId)
        )
        return { ...state, readPositions: [...newReadPositions, payload] }
      }

      default:
        return state
    }
  },
  selectors: {
    isAuthenticated: state => state.user.id !== undefined,

    getMessages: state =>
      state.user.messages.map(m => {
        console.log("READ POSITIONS ", state.user.readPositions)

        return {
          ...m,
          user: state.user.users.find(u => u.id === m.userId),
          readPositions: state.user.readPositions
            .filter(rp => rp.messageId === m.id)
            .map(rp => ({
              ...rp,
              user: state.user.users.find(u => u.id === rp.userId),
            })),
        }
      }),

    getGroups: state => state.user.groups,

    getChat: (state, groupId, chatName) => {
      const foundGroup = state.user.groups.find(g => g.id == groupId)
      if (!foundGroup) return
      return foundGroup.chats.find(c => c.name == chatName)
    },

    getGroupMessages: new Duck.Selector(selectors =>
      createCachedSelector(
        [
          selectors.getMessages,
          selectors.getGroups,
          (state, groupId) => groupId,
        ],

        (messages, groups, groupId) => {
          const foundGroup = groups.find(g => g.id == groupId)
          if (!foundGroup) return []

          const foundMessages = messages.filter(msg =>
            foundGroup.chats.find(c => c.id == msg.chatId)
          )

          return foundMessages
        }
      )((state, groupId) => groupId)
    ),

    getChatMessages: new Duck.Selector(selectors =>
      createCachedSelector(
        [
          (state, groupId, chatId) =>
            selectors.getGroupMessages(state, groupId),
          (state, groupId, chatId) => chatId,
        ],
        (groupMessages, chatId) => {
          const foundMessages = groupMessages.filter(m => m.chatId == chatId)
          return foundMessages
        }
      )((state, chatId) => chatId)
    ),

    // getGroupMessages: createSelector(
    //   [duck.selectors.getAllMessages],
    //   messages => {
    //     const foundGroup = state.user.groups.find(g => g.id === group)
    //   }
    // ),
  },
  creators: duck => {
    // ACTION CREATORS

    function subscribeToReadPositions(userId) {
      const observable = client.subscribe({
        query: gql`
        subscription newReadPosition {
          newReadPosition(forUserId: ${userId}) {
            id
            userId
            chatId
            messageId
          }
        }
      `,
      })

      console.log("SUBSCRIBING TO READ POSITIONS")

      return dispatch => {
        return observable.subscribe(response => {
          console.log("NEW READ POSITION", response)
          dispatch(addReadPosition(response.data.newReadPosition))
        })
      }
    }

    function subscribeToMessages(userId) {
      const observable = client.subscribe({
        query: gql`
        subscription newMessage {
          newMessage(forUserId: ${userId}) {
            id
            chatId
            userId
            content {
              type
              data
            }
          }
        }
      `,
      })

      console.log("SUBSCRIBING TO MESSAGES")

      // TODO: Use graphql fragment for friend request

      return dispatch => {
        return observable.subscribe(response => {
          dispatch(addMessages([response.data.newMessage]))
        })
      }
    }

    function subscribeToFriendRequests(id) {
      console.log("SUBSCRIBING TO FRIEND REQUESTS ")

      const observable = client.subscribe({
        query: gql`
          subscription newFriendRequest($toUserId: ID!) {
            newFriendRequest(toUserId: $toUserId) {
              id
              message
              createdAt
              fromUser {
                name
              }
            }
          }
        `,
        variables: {
          toUserId: id,
        },
      })

      // TODO: Use graphql fragment for friend request

      return dispatch => {
        return observable.subscribe(
          friendRequest => {
            // console.log("NEW FRIEND REQUEST", friendRequest)
            dispatch(addFriendRequest(friendRequest.data.newFriendRequest))
          },
          error => {
            console.log("why the fuck does god hate me")
            console.log(error)
          }
        )
      }
    }

    function loadInitialUser(id) {
      let userId = id
      return async dispatch => {
        console.log("[REDUX] Loading initial user state")
        dispatch(startUserLoading())

        // TODO: Move this query into independent file. Use graphql loader
        // from webpack.

        // TODO: Use try-catch here and handle user failure

        let response

        try {
          response = await query(initialUserQuery, { id: userId })
        } catch (err) {
          remove("token")
          remove("userId")
          console.error(err)
        }

        if (!response) {
          return dispatch(endUserLoading())
        }

        const {
          User: {
            id,
            name,
            username,
            friendRequests = [],
            friends = [],
            groups = [],
            allMessages = [],
            token,
          },
          relevantUsers = [],
        } = response.data

        if (token !== undefined) {
          dispatch(setUserMeta({ id, token }))
        } else {
          console.log("NO TOKEN")
        }

        dispatch(setUsers(relevantUsers))
        dispatch(setFriendRequests(friendRequests))
        dispatch(setGroups(groups))
        dispatch(setMessages(allMessages))
        dispatch(subscribeToFriendRequests(id))
        dispatch(subscribeToMessages(id))
        dispatch(subscribeToReadPositions(id))
        dispatch(endUserLoading())

        // TODO: dispatch and fill store with all this content
        // TODO: subscribe to new messages
        // TODO: selectors for groups and chats from the array of
        // all recent messages. Also need pagination here on the
        // initial call for allMessages.

        // TODO: QUESTION: How to do if a user wants messages before
        // the limit of the pagination here. Answer, probably refetch
        // the messages specifically of that chat if the user
        // starts scrolling up to see older messages. Then create
        // a scrolling paginated call for an infinite list
      }
    }

    function setUserMeta(payload) {
      return { type: duck.types.SET_USER_META, payload }
    }

    function addFriendRequest(friendRequest) {
      return { type: duck.types.ADD_FRIEND_REQUEST, friendRequest }
    }

    function addFriendRequests(requests) {
      return { type: duck.types.ADD_FRIEND_REQUESTS, requests }
    }

    function setFriendRequests(requests) {
      return { type: duck.types.SET_FRIEND_REQUESTS, requests }
    }

    function removeFriendRequest(id) {
      return { type: duck.types.REMOVE_FRIEND_REQUEST, id }
    }

    function addGroups(groups) {
      return { type: duck.types.ADD_GROUPS, groups }
    }

    function setGroups(groups) {
      return { type: duck.types.SET_GROUPS, groups }
    }

    function addMessages(messages) {
      return { type: duck.types.ADD_MESSAGES, messages }
    }

    function setMessages(messages) {
      return { type: duck.types.SET_MESSAGES, messages }
    }

    function setUsers(users) {
      return { type: duck.types.SET_USERS, users }
    }

    function startUserLoading() {
      return { type: duck.types.START_USER_LOADING }
    }

    function endUserLoading() {
      return { type: duck.types.END_USER_LOADING }
    }

    function logout() {
      return { type: duck.types.LOGOUT }
    }

    function addReadPosition(payload) {
      return { type: duck.types.ADD_READ_POSITION, payload }
    }

    return {
      subscribeToFriendRequests,
      subscribeToMessages,
      addFriendRequest,
      addFriendRequests,
      loadInitialUser,
      addGroups,
      addMessages,
      removeFriendRequest,
      logout,
    }
  },
})
