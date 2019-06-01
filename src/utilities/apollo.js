import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { createUploadLink } from "apollo-upload-client";

// Meta info for development

const localServerUrl = "localhost:8080";
let useLocal = process.env.NODE_ENV !== "production";

// Link parts

export const errorLink = onError(props => {
  const { graphQLErrors, networkError } = props;

  if (graphQLErrors) {
    graphQLErrors.map(error => {
      console.log("[Error Link] GraphQL Error");
      console.error(error);
    });
  } else if (networkError) {
    console.log("[Error Link] Network Error");
    console.error(networkError);
  } else {
    console.log("[Error Link] Unknown Type");
    console.error(props);
  }
});

const httpUri = useLocal
  ? `http://${localServerUrl}/graphql`
  : "https://remix-platform-server.herokuapp.com/graphql";

export const httpLink = new HttpLink({ uri: httpUri });

export const subEndpoint = useLocal
  ? `ws://${localServerUrl}/subscriptions`
  : "wss://remix-platform-server.herokuapp.com/subscriptions";

const link = ApolloLink.from([errorLink, httpLink, createUploadLink()]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
