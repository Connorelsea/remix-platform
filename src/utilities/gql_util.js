import gql from "graphql-tag"

import { client } from "./apollo"

export const query = (client, gql_query) =>
  client.query({
    query: gql`
      ${gql_query}
    `,
  })

export const mutate = (mutation, variables) =>
  client.mutate({
    mutation: gql`
      ${mutation}
    `,
    variables,
  })
