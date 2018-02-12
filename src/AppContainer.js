import React from "react"
import { hot } from "react-hot-loader"
import { Provider } from "react-redux"
import { ApolloProvider } from "react-apollo"
import store from "./utilities/storage/store"
import { client } from "./utilities/apollo"
import DataManager from "./components/DataManager"
import App from "./App"

class Container extends React.Component {
  render() {
    console.log("Rendering app container")
    console.log("STORE", store)
    return (
      <Provider store={store}>
        <ApolloProvider client={client}>
          <DataManager>
            <App />
          </DataManager>
        </ApolloProvider>
      </Provider>
    )
  }
}

// export default hot(module)(Container)

export default Container
