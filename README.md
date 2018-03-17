# Camino Network

## Albergue List

https://clearskiescamino.com/2016/01/17/google-maps-of-albergues-on-the-camino-frances/

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
