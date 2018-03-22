// @flow

import Duck from "extensible-duck"
import { client, errorLink, subEndpoint, httpLink } from "../utilities/apollo"
import gql from "graphql-tag"
import { query } from "../utilities/gql_util"
import createCachedSelector from "re-reselect"
import initialUserQuery from "./user.graphql"
import { remove, get, getArray } from "../utilities/storage"
import { ApolloClient } from "apollo-client"
import jwt from "jsonwebtoken"
import { GlobalState } from "../reducers/rootReducer"
import { setContext } from "apollo-link-context"
import { ApolloLink, split } from "apollo-link"
import { SubscriptionClient } from "subscriptions-transport-ws"
import { WebSocketLink } from "apollo-link-ws"
import { getMainDefinition } from "apollo-utilities"
import { InMemoryCache } from "apollo-cache-inmemory"

// Setting the auth device represents a logged in user. Removing
// the auth device represents logging out of a user account.

// A device can have or not have tokens. If a device does not have
// tokens, or if the refresh token is expired, they will need to
// enter their password before continuing.

// Before setting device,
// Check if access token is expired or not present (short life)
// If so, request a new access token using the refresh token

// Check if the refresh token is expired (long life)
// If so, call `refreshDeviceWithPassword` on the server side

type Device = {
  id: string,
  user: {
    id: string,
    name: string,
    username: string,
    email: string,
  },
  valid: string,
  trusted: string,
  refreshToken: string,
  accessToken: string,
}

// ACTION TYPE DEFINITIONS

type SetDevicesAction = {
  type: "SET_DEVICES",
  payload: { devices: Array<Device> },
}

type AddDeviceAction = {
  type: "ADD_DEVICE",
  payload: { device: Device },
}

type SetCurrentDeviceIdAction = {
  type: "SET_CURRENT_DEVICE_ID",
  payload: { deviceId: string },
}

type LoginWithCurrentDeviceAction = {
  type: "LOGIN_WITH_CURRENT_DEVICE",
}

type LoginWithDevicePasswordAction = {
  type: "LOGIN_WITH_DEVICE_PASSWORD",
  payload: { deviceId: string, password: string },
}

type SetApolloClientAction = {
  type: "SET_APOLLO_CLIENT",
  payload: {
    apolloClient: any,
  },
}

type LogoutAction = { type: "LOGOUT" }

type SetAuthStatusAction = {
  type: "SET_AUTH_STATUS",
  payload: { status: boolean },
}

type UpdateCurrentRefreshTokenType = {
  type: "UPDATE_CURRENT_REFRESH_TOKEN",
  payload: { password: string },
}

type UpdateCurrentAccessTokenType = { type: "UPDATE_CURRENT_ACCESS_TOKEN" }

type Action =
  | AddDeviceAction
  | SetCurrentDeviceIdAction
  | LoginWithCurrentDeviceAction
  | LoginWithDevicePasswordAction
  | SetApolloClientAction
  | LogoutAction
  | SetAuthStatusAction
  | UpdateCurrentRefreshTokenType
  | UpdateCurrentAccessTokenType

// Middleware action types
type PromiseAction = Promise<Action>
type ThunkAction = (dispatch: Dispatch, getState: () => State) => any

type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any

// ACTION CREATORS

/**
 * Add device to the existing array
 * TODO: Save this to local storage
 */
export function addDevice(device: Device): AddDeviceAction {
  return {
    type: "ADD_DEVICE",
    payload: { device },
  }
}

/**
 * Set the device that is currently being used for authentication. This device's
 * information will be used to create an apollo client and initialize the
 * application with that device's user's information.
 */
export function setCurrentDeviceId(deviceId: string): SetCurrentDeviceIdAction {
  return {
    type: "SET_CURRENT_DEVICE_ID",
    payload: { deviceId },
  }
}

const CurrentDeviceSelector = (state: GlobalState): Device =>
  state.auth.devices.find(device => device.id === state.auth.currentDeviceId)

/**
 *
 */
export function loginWithCurrentDevice(): ThunkAction {
  return async function(dispatch, getState) {
    // Note: Decode ignores whether the token is valid against the private
    // key. They are being decoded unsafetly here just to test expiration
    // times. If it is fake or edited, it would still fail since
    // these are also checked server-side.

    const state = getState()

    const accessToken = CurrentDeviceSelector(state).accessToken
    const refreshToken = CurrentDeviceSelector(state).refreshToken
    const decodedAccessToken = jwt.decode(accessToken)
    const decodedRefreshToken = jwt.decode(refreshToken)

    console.log("ACCESS TOKENS", decodedAccessToken, decodedRefreshToken)

    const currentTime: number = Date.now().valueOf() / 1000
    console.log("why are my tokens expired here")
    console.log(currentTime, decodedAccessToken.exp, decodedRefreshToken.exp)

    let accessTokenExpired = decodedAccessToken.exp < currentTime
    let refreshTokenExpired = decodedRefreshToken.exp < currentTime

    if (refreshTokenExpired) {
      // needs password
      console.log("Refresh token expired")
    }

    if (accessTokenExpired && !refreshTokenExpired) {
      // request new access token
      // update device's access token
      // set authenticated to true

      console.log("Refresh token expired")
    }

    if (!accessTokenExpired && !refreshTokenExpired) {
      console.log("Both are not expired, authenticated true")

      // Configure new apollo client specifically for this
      // authenticated user

      // Add user's access token
      let authLink = setContext((operation, prevContext) => {
        let state = getState()

        return {
          headers: {
            ...prevContext.headers,
            authorization: CurrentDeviceSelector(state).accessToken,
          },
        }
      })

      // Setup subscription client and subscription access

      const subOptions = {
        reconnect: true,
        connectionParams: async function() {
          let state = getState()

          return {
            token: CurrentDeviceSelector(state).accessToken,
          }
        },
      }

      const subClient = new SubscriptionClient(subEndpoint, subOptions)
      const subLink = new WebSocketLink(subClient)

      const connectionLink = split(
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query)
          return kind === "OperationDefinition" && operation === "subscription"
        },
        subLink,
        httpLink
      )

      const link = ApolloLink.from([errorLink, authLink, connectionLink])

      const apolloClient = new ApolloClient({
        link,
        cache: new InMemoryCache(),
      })

      dispatch(setApolloClient(apolloClient))

      // set authenticated to true
      dispatch(setAuthStatus(true))
    }

    // Is the access token expired?
    // If so, is the refresh token expired
    // If so, current device is invalid and will require password
    // If not, use refresh token to get new access token
    // If access token is function, set current device
    // Set timer to get new access token in 5 minutes
    // Check to see if refresh token expires soon
  }
}

/**
 * Login using a specific inactive device from the device array.
 */
function loginWithDevicePassword(
  deviceId: string,
  password: string
): LoginWithDevicePasswordAction {
  return {
    type: "LOGIN_WITH_DEVICE_PASSWORD",
    payload: { deviceId, password },
  }
}

function setApolloClient(apolloClient: any): SetApolloClientAction {
  return {
    type: "SET_APOLLO_CLIENT",
    payload: {
      apolloClient,
    },
  }
}

/**
 * Update the refresh token of the current auth device if the
 * refresh token has expired. This requires the user to enter
 * their password.
 */
function updateCurrentRefreshToken(
  password: string
): UpdateCurrentRefreshTokenType {
  return {
    type: "UPDATE_CURRENT_REFRESH_TOKEN",
    payload: { password },
  }
}

/**
 * Update the access token of the current auth device before it expires
 * while the user is using Remix. To get a new access token, a valid
 * refresh token is required.
 */
function updateCurrentAccessToken(): UpdateCurrentAccessTokenType {
  return {
    type: "UPDATE_CURRENT_ACCESS_TOKEN",
  }
}

/**
 * Logout of the device you logged into. This leaves the device data stored
 * in an unauthenticated state by removing the tokens.
 *
 * You can log back in using an unauthenticated device and the password
 * for that device's account.
 */
function logout(): LogoutAction {
  return { type: "LOGOUT" }
}

/**
 * Set authentication status
 */
export function setAuthStatus(status: boolean): SetAuthStatusAction {
  return {
    type: "SET_AUTH_STATUS",
    payload: { status },
  }
}

// Default non-authenticated apollo client for use before user
// is logged in

const link = ApolloLink.from([errorLink, httpLink])

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

// INITIAL STATE

export type State = {
  +devices: Array<Device>,
  +currentDeviceId: string | void,
  +apolloClient: ApolloClient | void,
  +authenticated: boolean,
}

const initialState: State = {
  devices: [],
  currentDeviceId: undefined,
  authenticated: false,
  apolloClient,
}

// REDUCER

function reducer(state: State = initialState, action: Action): State {
  console.log("IN REDUCER", action)

  switch (action.type) {
    case "ADD_DEVICE": {
      return {
        ...state,
        devices: [...state.devices, action.payload.device],
      }
    }

    case "SET_CURRENT_DEVICE_ID": {
      return {
        ...state,
        currentDeviceId: action.payload.deviceId,
        authenticated: false, // needs to check validity first, then true
      }
    }

    case "SET_AUTH_STATUS": {
      return {
        ...state,
        authenticated: action.payload.status,
      }
    }

    case "SET_APOLLO_CLIENT": {
      return {
        ...state,
        apolloClient: action.payload.apolloClient,
      }
    }

    default:
      return state
  }
}

export default reducer
