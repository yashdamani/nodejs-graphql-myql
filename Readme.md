<b><h3>Here's the list to all the GraphQL Queries and Mutations:</h3></b>

<b>1. To add a user</b>

<code> mutation addUser{
  addUser(email:<String>, username: <String>, password: <String>) {
  id
  }
  } </code>

<b>2. To tweet</b>

<code> mutation addTweet{
  addTweet(userId:<Integer>, body:<String>) {
    id
  }
} </code>

<b>3. To follow a user</b>

<code> mutation follow{
  follow(userId:<Integer>, follower_id:<Integer>) {
    userId 
  }
} </code>

<b>4. To see a list of users</b>

<code> {
  users{
    id username
  }
} </code>


<b>5. To see a list of user's own posts:
for a given user's id, fetches all the tweets of the user</b>

<code> {
  users(id:<Integer>) {
    tweets{
      body
    }
  }
} </code>

<b>6.To see a list of followers:
for a given user's id, fetches all the followers</b>

<code> {
  users(id:<Integer>) {
    followers{
      user {
        username id email
      }
    }
  }
} </code>

<b>7. To see a user's followers tweets (feed)</b>

<code> {
  users(id:<Integer>) {
    followers{
      user {
        username id
        tweets{
          body
        }
      }
    }
  }
} </code>




