import gql from "graphql-tag";

import { client } from "./apollo";

export const query = (query, variables, clientOverride = client) =>
  clientOverride.query({
    query: gql`
      ${query}
    `,
    variables
  });

export const mutate = (mutation, variables) =>
  client.mutate({
    mutation: gql`
      ${mutation}
    `,
    variables
  });

export const subscribe = (subscription, variables) =>
  client.subscribe({
    subscription: gql`
      ${subscription}
    `,
    variables
  });
