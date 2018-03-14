// @flow

import Duck from "extensible-duck"
import { client } from "../utilities/apollo"
import gql from "graphql-tag"
import { query } from "../utilities/gql_util"
import createCachedSelector from "re-reselect"
import initialUserQuery from "./user.graphql"
import { remove, get, getArray } from "../utilities/storage"
import { ApolloClient } from "apollo-client"
import jwt from "jsonwebtoken"
import { GlobalState } from "../reducers/rootReducer"

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

type LoginWithCurrentDevice = {
  type: "LOGIN_WITH_CURRENT_DEVICE",
}

type LoginWithDevicePasswordAction = {
  type: "LOGIN_WITH_DEVICE_PASSWORD",
  payload: { deviceId: string, password: string },
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
  | SetDevicesAction
  | AddDeviceAction
  | SetCurrentDeviceIdAction
  | LoginWithCurrentDevice
  | LoginWithDevicePasswordAction
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
 * Load an array of one or more devices from the device's local
 * storage. The type of storage depends on the platform.
 */
export function loadDevicesFromStorage(): ThunkAction {
  return async function(dispatch) {
    let devices: Array<Device> = await getArray("devices")
    let currentDeviceId: string = await get("currentDeviceId")

    // TODO: Use SELECTOR to get device from devices array using deviceId
    // memoize

    if (devices) dispatch(setDevices(devices))
    if (currentDeviceId) {
      dispatch(setCurrentDeviceId(currentDeviceId))
      dispatch(loginWithCurrentDevice())
    }
  }
}

/**
 * Set initial  devices on the redux store
 * TODO: Save this to local storage
 */
export function setDevices(devices: Array<Device>): SetDevicesAction {
  return {
    type: "SET_DEVICES",
    payload: { devices },
  }
}

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

    const decodedAccessToken = jwt.decode(
      CurrentDeviceSelector(state).accessToken
    )

    const decodedRefreshToken = jwt.decode(
      CurrentDeviceSelector(state).refreshToken
    )

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

      // configure apollo client with access token access
      // how? idk yet TODO

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
function loginWithDeviceActive(deviceId: string): LoginWithDeviceActiveAction {
  return {
    type: "LOGIN_WITH_DEVICE_ACTIVE",
    payload: { deviceId },
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
  apolloClient: undefined,
}

// REDUCER

function reducer(state: State = initialState, action: Action): State {
  console.log("IN REDUCER", action)

  switch (action.type) {
    case "SET_DEVICES": {
      // const castAction: SetDevicesAction = (action: SetDevicesAction)

      return {
        ...state,
        devices: action.payload.devices,
      }
      // Persist to local storage here
    }

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
      // persist to local storage here
      // TODO: Load devices from storage when application loads
    }

    case "SET_AUTH_STATUS": {
      console.log("SETTING AUTH STATUS", action)
      return {
        ...state,
        authenticated: action.payload.status,
      }
    }

    default:
      return state
  }
}

export default reducer
