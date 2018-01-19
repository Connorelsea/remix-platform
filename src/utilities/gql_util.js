import gql from "graphql-tag"

import { client } from "./apollo"

export const query = (gql_query, variables) =>
  client.query({
    query: gql`
      ${gql_query}
    `,
    variables,
  })

export const mutate = (mutation, variables) =>
  client.mutate({
    mutation: gql`
      ${mutation}
    `,
    variables,
  })
