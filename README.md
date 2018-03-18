# Camino Network

## Albergue List

https://clearskiescamino.com/2016/01/17/google-maps-of-albergues-on-the-camino-frances/

## Example Queries

### Sign Up User

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

### Login

```graphql
query {
  user: login(email: "fox@example.com", password: "trustno1") {
    token
  }
}
```

### Autocomplete Location Name

```graphql
query AutocompleteLocation {
	allLocations(
    first: 10,
    filter: { name_contains: "pamplo", }
  ) {
    name
  }
}
```
