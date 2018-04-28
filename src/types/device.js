// @flow

export type Device = {
  id: string,
  name: string,
  user: {
    id: string,
    name: string,
    username: string,
    email: string
  },
  valid: string,
  trusted: string,
  refreshToken: string,
  accessToken: string
};
