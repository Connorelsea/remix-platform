# Redux Store Sub-Sections

Note when building, any server query or mutation is a point of failure where the server itself or a server-side validation related to the query or mutation could fail resulting in an error that should be checked and handled on the frontend. Such as automatically saving a message to drafts when the internet fails or sending fails.

Note for subscriptions, it is implied that for subscriptions such as `newMessage`, `newFriend`, `newActivityUpdate` will be scoped from the server-side with only relevant updates. For example, new activity updates will only come from your friends, not from random users, as that would be an invasion of their privacy and an obvious performance concern.

---

* identity

  * users: `Array<Users>`

---

* auth

  * properties

    * devices: `Array<Device>`
    * currentDeviceId: `ID`
    * apolloClient: `ApolloClient`
    * authenticated: `boolean`
    * expiredRefreshToken: `boolean`

  * actions

    * setCurrentDeviceId

  * mutations (actions with gql server mutation side-effects)

    * addDevice
    * replaceDevice
    * getNewAccessToken
    * loginWithCurrentDevice
    * getNewRefreshToken

---

* requests

  * properties

    * friendRequests: `Array<FriendRequest>`
    * groupInvitations: `Array<GroupInvitation>`
    * pendingFriendRequests: `Array<FriendRequest>`
    * pendingGroupInvitations: `Array<GroupInvitation>`

  * subscriptions

    * newFriendRequest
    * newGroupInvitation
    * newAcceptedFriendRequest ??? (better name maybe? or put in `friends` duck?)

---

* groups

  * properties

    * groups : `Array<Group>`

  * mutations (actions with gql server mutation side-effects)

    * addChat : `(groupId: ID, name: string, description: string) => Chat`

  * subscriptions

    * newGroup

---

* readPositions

  * properties

    * readPositions : `{ [userId]: { [chatId]: messageId } }` -

  * actions

    * addReadPosition : `(chatId: ID, userId: ID, messageId: ID) => ReadPosition`
      * comments: unique on keys chatId and userId. stored at `readPositions[userId][chatId]` messageId is the most recently read message

  * mutations (actions with gql server mutation side-effects)

    * updateMyReadPosition : `(chatId: ID, userId: ID, messageId: ID) => ReadPosition`

  * subscriptions

    * newReadPosition

---

* messages

  * properties

    * messages : `Array<Message>`

  * actions (edits the local redux store, `messages`)

    * addMessage : `(message: Message) => boolean`
    * editExistingMessage : `(messageId: ID, newMessage: Message) => boolean`

  * mutations (actions with gql server mutation side-effects, also updates local store)

    * sendNewMessage : `(chatId: ID, message: Message) => Message`
    * editMyMessage : `(messageId: ID, updatedMessage: Message) => Message`

  * subscriptions

    * newMessage
    * newMessageEdit

---

* activity

  * properties

    * activityUpdates: `Array<ActivityUpdate>`

  * selectors (maybe)

    * GetUserActivityUpdates
    * GetRecentUserActivityUpdate

  * actions (edits the local redux store, `activityUpdates`)

    * addActivityUpdate : `(activityUpdate: ActivityUpdate) => boolean`

  * mutations (actions with gql server mutation side-effects)

    * sendActivityUpdate : `(activityUpdate: ActivityUpdate) => ActivityUpdate`

  * subscriptions

    * newActivityUpdate

---

* friends

  * properties

    * friendIds : `Array<ID>`

  * mutations

    * getFriendsUserMeta : `() => Array<User>`

  * subscriptions

    * newFriend
