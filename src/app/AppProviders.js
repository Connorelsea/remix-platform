import React from "react"
import { ApolloProvider } from "react-apollo"
import { client } from "../utilities/apollo"
import { Provider } from "react-redux"
import { hot } from "react-hot-loader"
import ThemeManager from "./ThemeManager"
import DataManager from "../components/DataManager"
import store from "../utilities/storage/store"
import App from "./App"

class Container extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <DataManager>
            <ThemeManager>
              <App />
            </ThemeManager>
          </DataManager>
        </ApolloProvider>
      </Provider>
    )
  }
}

export default hot(module)(Container)
