import { ApolloClient } from "apollo-client"
import { createHttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
import { InMemoryCache } from "apollo-cache-inmemory"
import { SubscriptionClient } from "subscriptions-transport-ws"
import { WebSocketLink } from "apollo-link-ws"
import { getMainDefinition } from "apollo-utilities"

import { get } from "./storage"

import { onError } from "apollo-link-error"
import { ApolloLink, split } from "apollo-link"

const errorLink = onError(props => {
  const { graphQLErrors, networkError } = props
  console.log("ON ERROR", props)
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const useLocal = true

const httpLink = useLocal
  ? createHttpLink({
      uri: "http://localhost:8080/graphql",
    })
  : createHttpLink({
      uri: "https://remix-platform-server.herokuapp.com/graphql",
    })

const authLink = setContext(async (_, { headers }) => {
  // console.log("Attempting to find token")
  let token
  try {
    token = await get("token")
    // console.log(token)
  } catch (err) {
    console.error(err)
  }
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  }
})

const subEndpoint = "ws://localhost:8080/subscriptions"
const subOptions = { reconnect: true }

const subClient = new SubscriptionClient(subEndpoint, subOptions)
const subLink = new WebSocketLink(subClient)

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const connectionLink = split(
  // split based on operation type
  ({ query }) => {
    if (query === undefined) console.log("UNDEFINED QUERY")
    console.log("[APP QUERY] App made query", query)
    const { kind, operation } = getMainDefinition(query)
    return kind === "OperationDefinition" && operation === "subscription"
  },
  subLink,
  httpLink
)

const link = ApolloLink.from([errorLink, authLink, connectionLink])

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
