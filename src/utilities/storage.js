import { Platform, AsyncStorage } from "react-native"

export const set = (key, value) => {
  if (Platform.OS === "web") return localStorage.setItem(key, value)
  else return AsyncStorage.setItem(key, value)
}
export const get = async key => {
  if (Platform.OS === "web") return await localStorage.getItem(key)
  else return await AsyncStorage.getItem(key)
}
