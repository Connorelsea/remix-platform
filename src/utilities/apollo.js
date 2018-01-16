import { ApolloClient } from "apollo-client"
import { createHttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
import { InMemoryCache } from "apollo-cache-inmemory"

import { get } from "./storage"

const httpLink = createHttpLink({
  uri: "http://127.0.0.1:3000/graphql",
})

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  // TODO: Abstract getItem from storage here to work across platforms
  // Also make sure this works when there is no token available
  // let token // = localStorage.getItem("token")
  console.log("Attempting to find token")
  let token
  try {
    token = await get("token")
    console.log(token)
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

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
