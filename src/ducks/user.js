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
    "REMOVE_FRIEND_REQUEST",
    "ADD_GROUPS",
    "ADD_MESSAGES",
    "ADD_FRIENDS",
  ],
  initialState: {
    friendRequests: [],
    friends: [],
    groups: [],
    messages: [],
  },
  reducer: (state, action, duck) => {
    console.log(action)
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

      case duck.types.REMOVE_FRIEND_REQUEST: {
        const { id } = action

        const friendRequests = state.friendRequests.filter(req => req.id !== id)

        return { ...state, friendRequests }
      }

      case duck.types.ADD_GROUPS: {
        const { groups } = action
        return { ...state, groups: [...state.groups, ...groups] }
      }

      case duck.types.ADD_MESSAGES: {
        const { messages } = action
        return { ...state, messages: [...state.messages, ...messages] }
      }

      default:
        return state
    }
  },
  creators: duck => {
    // ACTION CREATORS

    function subscribeToFriendRequests(id) {
      const observable = client.subscribe({
        query: gql`
        subscription newFriendRequest {
          newFriendRequest(toUserId: ${id}) {
            id
            message
            createdAt
            fromUser {
              name
            }
          }
        }
      `,
      })

      // TODO: Use graphql fragment for friend request

      return dispatch => {
        return observable.subscribe(friendRequest => {
          dispatch(addFriendRequest(friendRequest.data.newFriendRequest))
        })
      }
    }

    function loadInitialUser(id) {
      return async dispatch => {
        const response = await query(`
          {
            User(id: ${id}) {
              id
              name
              username
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
              }
              allMessages {
                id
                chatId
                content {
                  type
                  data
                }
              }
            }
          }
        `)

        console.log(response)

        const {
          User: {
            name,
            username,
            friendRequests,
            friends,
            groups,
            allMessages,
          },
        } = response.data

        dispatch(addFriendRequests(friendRequests))
        dispatch(addGroups(groups))
        dispatch(addMessages(allMessages))

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

    function removeFriendRequest(id) {
      return { type: duck.types.REMOVE_FRIEND_REQUEST, id }
    }

    function addGroups(groups) {
      return { type: duck.types.ADD_GROUPS, groups }
    }

    function addMessages(messages) {
      return { type: duck.types.ADD_MESSAGES, messages }
    }

    return {
      subscribeToFriendRequests,
      addFriendRequest,
      addFriendRequests,
      loadInitialUser,
      addGroups,
      addMessages,
      removeFriendRequest,
    }
  },
})
