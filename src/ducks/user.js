import Duck from "extensible-duck"
import { client } from "../utilities/apollo"
import gql from "graphql-tag"
import { query } from "../utilities/gql_util"

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
  ],
  initialState: {
    friendRequests: [],
    friends: [],
    groups: [],
    messages: [],
    users: [],
  },
  reducer: (state, action, duck) => {
    switch (action.type) {
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

      default:
        return state
    }
  },
  creators: duck => {
    // ACTION CREATORS

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
          console.log("GOT MESSAGE", response)
          dispatch(addMessages([response.data.newMessage]))
        })
      }
    }

    function subscribeToFriendRequests(id) {
      console.log("SUBSCRIBING WITH ID " + id)

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
      return async dispatch => {
        console.log("[REDUX] Loading initial user state")

        const response = await query(`
          {
            User(id: ${id}) {
              id
              name
              username
              color
              friendRequests {
                id
                message
                createdAt
                fromUser {
                  name
                }
              }
              friends {
                id
              }
              groups {
                id
                iconUrl
                name
                description
                isDirectMessage
                chats {
                  id
                  name
                }
                members {
                  id
                }
              }
              allMessages {
                id
                chatId
                userId
                content {
                  type
                  data
                }
              }
            }
            relevantUsers {
              id
              name
              username
              color
            }
          }
        `)

        const {
          User: {
            name,
            username,
            friendRequests = [],
            friends = [],
            groups = [],
            allMessages = [],
          },
          relevantUsers = [],
        } = response.data

        dispatch(setFriendRequests(friendRequests))
        dispatch(setGroups(groups))
        dispatch(setMessages(allMessages))
        dispatch(setUsers(relevantUsers))

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

    return {
      subscribeToFriendRequests,
      subscribeToMessages,
      addFriendRequest,
      addFriendRequests,
      loadInitialUser,
      addGroups,
      addMessages,
      removeFriendRequest,
    }
  },
})
