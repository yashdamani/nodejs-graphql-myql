Here's the list to all the GraphQL Queries and Mutations:

1. To add a user

mutation addUser{
  addUser(email:"ketandamani@gmail.com", username: "ketandamani", password: "ketan") {
  id
  }
}

2. To tweet

mutation addTweet{
  addTweet(userId:3, body:"megha's 3rd tweet") {
    id
  }
}

3. To follow a user

mutation follow{
  follow(userId:1, follower_id:2) {
    userId 
  }
}

4. To see a list of users

{
  users{
    id username
  }
}


4. To see a list of user's own posts:
for a given user's id, fetches all the tweets of the user

{
  users(id:1) {
    tweets{
      body
    }
  }
}

5.To see a list of followers:
for a given user's id, fetches all the followers

{
  users(id:1) {
    followers{
      user {
        username id email
      }
    }
  }
}

6. To see a user's followers tweets (feed)

{
  users(id:1) {
    followers{
      user {
        username id
        tweets{
          body
        }
      }
    }
  }
}




