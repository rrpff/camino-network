# Camino Network

## Example Queries

### Sign up user

```graphql
mutation {
  signupUser(
    email: "fox@example.com",
    name: "Fox Mulder",
    password: "trustno1"
  ) {
    id
  }
}
```
