// @flow

import Duck from "extensible-duck";
import { client, errorLink, subEndpoint, httpLink } from "../utilities/apollo";
import gql from "graphql-tag";
import { query, mutate } from "../utilities/gql_util";
import createCachedSelector from "re-reselect";
import initialUserQuery from "./user.graphql";
import { remove, get, getArray } from "../utilities/storage";
import { ApolloClient } from "apollo-client";
import jwt from "jsonwebtoken";
import { GlobalState } from "../reducers/rootReducer";
import { setContext } from "apollo-link-context";
import { ApolloLink, split } from "apollo-link";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";
import { type Device } from "../types/device";

// Default non-authenticated apollo client for use before user
// is logged in

const link = ApolloLink.from([errorLink, httpLink]);

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

// INITIAL STATE

export type State = {
  +devices: Array<Device>,
  +currentDeviceId: string | void,
  +apolloClient: ApolloClient,
  +authenticated: boolean,
  +expiredRefreshToken: boolean
};

const initialState: State = {
  devices: [],
  currentDeviceId: undefined,
  authenticated: false,
  apolloClient,
  expiredRefreshToken: false
};

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

// ACTION TYPE DEFINITIONS

type SetDevicesAction = {
  type: "SET_DEVICES",
  payload: { devices: Array<Device> }
};

type AddDeviceAction = {
  type: "ADD_DEVICE",
  payload: { device: Device }
};

type ReplaceDeviceAction = {
  type: "REPLACE_DEVICE",
  payload: { device: Device }
};

type SetCurrentDeviceIdAction = {
  type: "SET_CURRENT_DEVICE_ID",
  payload: { deviceId: string }
};

type LoginWithCurrentDeviceAction = {
  type: "LOGIN_WITH_CURRENT_DEVICE"
};

type LoginWithDevicePasswordAction = {
  type: "LOGIN_WITH_DEVICE_PASSWORD",
  payload: { deviceId: string, password: string }
};

type SetApolloClientAction = {
  type: "SET_APOLLO_CLIENT",
  payload: {
    apolloClient: any
  }
};

type LogoutAction = { type: "LOGOUT" };

type SetExpiredRefreshTokenAction = {
  type: "SET_EXPIRED_REFRESH_TOKEN",
  payload: {
    expired: boolean
  }
};

type SetAuthStatusAction = {
  type: "SET_AUTH_STATUS",
  payload: { status: boolean }
};

type UpdateCurrentRefreshTokenType = {
  type: "UPDATE_CURRENT_REFRESH_TOKEN",
  payload: { password: string }
};

type UpdateCurrentAccessTokenType = { type: "UPDATE_CURRENT_ACCESS_TOKEN" };

type Action =
  | AddDeviceAction
  | ReplaceDeviceAction
  | SetCurrentDeviceIdAction
  | LoginWithCurrentDeviceAction
  | LoginWithDevicePasswordAction
  | SetApolloClientAction
  | LogoutAction
  | SetExpiredRefreshTokenAction
  | SetAuthStatusAction
  | UpdateCurrentRefreshTokenType
  | UpdateCurrentAccessTokenType;

// Middleware action types
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: () => State) => any;

type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

// ACTION CREATORS

/**
 * Add device to the existing array
 */
export function addDevice(device: Device): AddDeviceAction {
  return {
    type: "ADD_DEVICE",
    payload: { device }
  };
}

/**
 * Replace the device with the same id in store with the new device
 */
export function replaceDevice(device: Device): ReplaceDeviceAction {
  return {
    type: "REPLACE_DEVICE",
    payload: { device }
  };
}
/**
 * Set the device that is currently being used for authentication. This device's
 * information will be used to create an apollo client and initialize the
 * application with that device's user's information.
 */
export function setCurrentDeviceId(deviceId: string): SetCurrentDeviceIdAction {
  return {
    type: "SET_CURRENT_DEVICE_ID",
    payload: { deviceId }
  };
}

export const CurrentDeviceSelector = (state: GlobalState): Device =>
  state.auth.devices.find(device => device.id === state.auth.currentDeviceId);

const getNewAccessTokenSource = `
  mutation getNewAccessToken(
    $refreshToken: String!
  ) {
    getNewAccessToken(
      refreshToken: $refreshToken
    ) {
      id
      name
      accessToken
      refreshToken
      valid
      user {
        id
      }
    }
  }
`;

async function getNewAccessToken(dispatch: Dispatch, refreshToken) {
  const response = await mutate(getNewAccessTokenSource, { refreshToken });
  const newDevice = response.data.getNewAccessToken;
  dispatch(replaceDevice(newDevice));
  return newDevice;
}

export type TokenMeta = {
  isExpired: boolean,
  expiresIn: number,
  updateAfterMs: number
};

function decodeToken(token: string): TokenMeta {
  const currentTime: number = Date.now().valueOf() / 1000;
  const decoded = jwt.decode(token);

  return {
    isExpired: decoded.exp < currentTime,
    expiresIn: decoded.exp - currentTime,
    updateAfterMs: (decoded.exp - currentTime - 3) * 1000
  };
}

/**
 * Login using the current device ID
 */
export function loginWithCurrentDevice(): ThunkAction {
  return async function(dispatch, getState) {
    // Note: Decode ignores whether the token is valid against the private
    // key. They are being decoded unsafetly here just to test expiration
    // times. If it is fake or edited, it would still fail since
    // these are also checked server-side.

    console.log(
      "[LWCD:LoginWithCurrentDevice] Attempting to fetch tokens from storage"
    );

    const state = getState();

    const accessToken = CurrentDeviceSelector(state).accessToken;
    const refreshToken = CurrentDeviceSelector(state).refreshToken;

    const accessTokenMeta: TokenMeta = decodeToken(accessToken);
    const refreshTokenMeta: TokenMeta = decodeToken(refreshToken);

    console.log(
      "[LWCD:Event] Recieved and decoded tokens for the current device"
    );
    console.log("[LWCD:Data] Access Token: ", accessTokenMeta);
    console.log("[LWCD:Data] Refresh Token: ", refreshTokenMeta);

    console.log(
      "[LWCD:Data] Access token expires in ~" +
        Math.round(accessTokenMeta.expiresIn) +
        "s"
    );

    console.log(
      "[LWCD:Data] Refresh token expires in ~" +
        Math.round(refreshTokenMeta.expiresIn) +
        "s"
    );

    if (refreshTokenMeta.isExpired) {
      console.log("[LWCD:Data] Refresh token is expired");
      dispatch(setRefreshTokenExpired(true));
    } else {
      console.log(
        `[LWCD:Timer] ${
          refreshTokenMeta.expiresIn
        }s until updating refresh token`
      );
      let updateAfterMs = (refreshTokenMeta.expiresIn - 3) * 1000;
      setTimeout(() => dispatch(setRefreshTokenExpired(true)), updateAfterMs);
    }

    if (accessTokenMeta.isExpired && !refreshTokenMeta.isExpired) {
      // request new access token
      // update device's access token
      // set authenticated to true

      console.log("[LWCD:Data] Access token is expired");

      const response = await mutate(getNewAccessTokenSource, { refreshToken });
      const newDevice = response.data.getNewAccessToken;

      dispatch(replaceDevice(newDevice));

      console.log(
        "[LWCD:Event] Got new device, updated access token",
        newDevice
      );
    }

    if (!accessTokenMeta.isExpired && !refreshTokenMeta.isExpired) {
      console.log(
        "[LWCD:Data] Both tokens unexpired. Creating authenticated apollo client"
      );

      // Update the access token a few seconds before it expires. Check the
      // new expiration time on each new device and make a new timer for the
      // new time accordingly.

      let updateAfterMs = (accessTokenMeta.expiresIn - 3) * 1000;

      function genTimeoutFn(dispatch, refreshToken) {
        return async function timeoutCallback() {
          console.log(
            "[UpdateAccessToken:Data] Attempting to get updated device"
          );

          const device = await getNewAccessToken(dispatch, refreshToken);
          const accessToken = device.accessToken;
          const decodedAccessToken: TokenMeta = decodeToken(accessToken);

          console.log(
            "[UpdateAccessToken:Event] Got device and decoded access token",
            decodedAccessToken
          );

          setTimeout(timeoutCallback, decodedAccessToken.updateAfterMs);
        };
      }

      console.log(
        `[LWCD:Timer] ${accessTokenMeta.expiresIn}s until updating access token`
      );
      setTimeout(genTimeoutFn(dispatch, refreshToken), updateAfterMs);

      // Configure new apollo client specifically for this
      // authenticated user

      // Add user's access token
      let authLink = setContext((operation, prevContext) => {
        let state = getState();

        return {
          headers: {
            ...prevContext.headers,
            authorization: CurrentDeviceSelector(state).accessToken
          }
        };
      });

      // Setup subscription client and subscription access

      const subOptions = {
        reconnect: true,
        connectionParams: async function() {
          let state = getState();

          return {
            token: CurrentDeviceSelector(state).accessToken
          };
        }
      };

      const subClient = new SubscriptionClient(subEndpoint, subOptions);
      const subLink = new WebSocketLink(subClient);

      const connectionLink = split(
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query);
          return kind === "OperationDefinition" && operation === "subscription";
        },
        subLink,
        httpLink
      );

      const link = ApolloLink.from([errorLink, authLink, connectionLink]);

      const apolloClient = new ApolloClient({
        link,
        cache: new InMemoryCache()
      });

      console.log(
        "[LWCD:Data] Created client successfully, setting authentication status."
      );

      dispatch(setApolloClient(apolloClient));
      dispatch(setAuthStatus(true));
      dispatch(setRefreshTokenExpired(false));
    }
  };
}

export function getNewRefreshToken(
  deviceId: string,
  email: string,
  password: string
): ThunkAction {
  return async (dispatch, getState) => {
    console.log(
      "[NewRefreshToken] Attempting to get a new refresh token for " + email
    );

    // Get redux state

    const state: GlobalState = getState();

    // Find device in redux store that matches provided deviceId

    const device: Device | void = state.auth.devices.find(
      d => d.id === deviceId
    );

    console.log("[NewRefreshToken] Found device by id in local state", device);

    if (!device) return false;

    // Request new refresh token from the server

    const getNewRefreshTokenSource = `
      mutation getNewRefreshToken(
        $refreshToken: String!
        $email: String!
        $password: String!
      ) {
        getNewRefreshToken(
          refreshToken: $refreshToken
          email: $email
          password: $password
        ) {
          id
          name
          accessToken
          refreshToken
          user {
            id
          }
        }
      }
    `;

    const variables = {
      refreshToken: device.refreshToken,
      email,
      password
    };

    let getNewRefreshTokenResponse: {
      data: {
        getNewRefreshToken: Device
      }
    } | void;

    try {
      getNewRefreshTokenResponse = await mutate(
        getNewRefreshTokenSource,
        variables
      );
    } catch (e) {
      // fires when server is offline or incorrect query, etc
      console.error(e);
    }

    if (!getNewRefreshTokenResponse) return false;

    const newDevice: Device =
      getNewRefreshTokenResponse.data.getNewRefreshToken;

    console.log("[NewRefreshToken] Recieved new device", newDevice);

    dispatch(replaceDevice(newDevice));
    return true;
  };
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
    payload: { deviceId, password }
  };
}

function setApolloClient(apolloClient: any): SetApolloClientAction {
  return {
    type: "SET_APOLLO_CLIENT",
    payload: {
      apolloClient
    }
  };
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
    payload: { password }
  };
}

/**
 * Update the access token of the current auth device before it expires
 * while the user is using Remix. To get a new access token, a valid
 * refresh token is required.
 */
function updateCurrentAccessToken(): UpdateCurrentAccessTokenType {
  return {
    type: "UPDATE_CURRENT_ACCESS_TOKEN"
  };
}

/**
 *  Set whether the refresh token is expired or not. If it is, a special
 *  UI state will be shown.
 */
function setRefreshTokenExpired(
  expired: boolean
): SetExpiredRefreshTokenAction {
  return {
    type: "SET_EXPIRED_REFRESH_TOKEN",
    payload: { expired }
  };
}

/**
 * Logout of the device you logged into. This leaves the device data stored
 * in an unauthenticated state by removing the tokens.
 *
 * You can log back in using an unauthenticated device and the password
 * for that device's account.
 */
function logout(): LogoutAction {
  return { type: "LOGOUT" };
}

/**
 * Set authentication status
 */
export function setAuthStatus(status: boolean): SetAuthStatusAction {
  return {
    type: "SET_AUTH_STATUS",
    payload: { status }
  };
}

// REDUCER

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case "ADD_DEVICE": {
      return {
        ...state,
        devices: [...state.devices, action.payload.device]
      };
    }

    case "REPLACE_DEVICE": {
      const { device } = action.payload;

      return {
        ...state,
        devices: [...state.devices.filter(d => d.id !== device.id), device]
      };
    }

    case "SET_CURRENT_DEVICE_ID": {
      return {
        ...state,
        currentDeviceId: action.payload.deviceId,
        authenticated: false // needs to check validity first, then true
      };
    }

    case "SET_AUTH_STATUS": {
      return {
        ...state,
        authenticated: action.payload.status
      };
    }

    case "SET_APOLLO_CLIENT": {
      return {
        ...state,
        apolloClient: action.payload.apolloClient
      };
    }

    case "SET_EXPIRED_REFRESH_TOKEN": {
      return {
        ...state,
        expiredRefreshToken: action.payload.expired
      };
    }

    default:
      return state;
  }
}

export default reducer;
