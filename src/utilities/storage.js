// @flow

import { Platform, AsyncStorage } from "react-native"

export function remove(key: string): Promise<string> {
  if (Platform.OS === "web") return localStorage.removeItem(key)
  else return AsyncStorage.removeItem(key)
}

export function get(key: string): string | Promise<string> {
  if (Platform.OS === "web") return localStorage.getItem(key)
  else return AsyncStorage.getItem(key)
}

export function set(key: string, value: any): Promise<void> {
  if (Platform.OS === "web") return localStorage.setItem(key, value)
  else return AsyncStorage.setItem(key, value)
}

export async function exists(key: string): Promise<boolean> {
  const item: any = await get(key)
  if (item === undefined || item === null) return false
  else if (item.trim() === "") return false
  else return true
}

export function setArray(key: string, array: Array<any>): Promise<void> {
  const serializedArray: string = JSON.stringify(array)
  return set(key, serializedArray)
}

export async function getArray(key: string): Promise<Array<any>> {
  let serializedArray: string = await get(key)
  return JSON.parse(serializedArray)
}

export async function addToArray(key: string, item: any): Promise<number> {
  let a: Array<any> = await getArray(key)
  a.push(item)
  return a.length
}
