import React from "react"
import Message from "../components/Message"

export default ({ name, color, text, currentUser }) => (
  <Message
    content={{ type: "remix/text", data: { text } }}
    user={{ id: -1, name, color }}
    prev={{}}
    style={{ opacity: 1 }}
    currentUser={currentUser ? { id: -1 } : { id: -2 }}
    readPositions={[]}
  />
)
