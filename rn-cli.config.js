module.exports = {
  getTransformModulePath() {
    return require.resolve("react-native-graphql-transformer")
  },
  getSourceExts() {
    return ["gql", "graphql"]
  },
}
