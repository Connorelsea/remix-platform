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

// Meta info for development

const localServerUrl = "localhost:8080"
let useLocal = process.env.NODE_ENV !== "production"

// Link parts

export const errorLink = onError(props => {
  const { graphQLErrors, networkError } = props

  if (graphQLErrors) {
    graphQLErrors.map(error => {
      console.log("[Error Link] GraphQL Error")
      console.error(error)
    })
  } else if (networkError) {
    console.log("[Error Link] Network Error")
    console.error(networkError)
  } else {
    console.log("[Error Link] Unknown Type")
    console.error(props)
  }
})

const httpUri = useLocal
  ? `http://${localServerUrl}/graphql`
  : "https://remix-platform-server.herokuapp.com/graphql"

export const httpLink = createHttpLink({
  uri: httpUri,
})

const authLink = setContext(async (_, { headers }) => {
  console.log("Attempting to find token")
  let token
  try {
    token = await get("accessToken")
    console.log("GOT ACCESS TOKEN", token)
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

export const subEndpoint = useLocal
  ? `ws://${localServerUrl}/subscriptions`
  : "wss://remix-platform-server.herokuapp.com/subscriptions"

const subOptions = {
  reconnect: true,
  connectionParams: async () => {
    let token = await get("token")
    let ret = {
      token,
    }

    console.log("WEBSOCKET RETURN OBJEDCT", ret)

    return ret
  },
}

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
