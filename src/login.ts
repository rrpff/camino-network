import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'
import * as bcrypt from 'bcryptjs'

interface EventData {
  readonly email: string
  readonly password: string
}

interface User {
  readonly id: string
  readonly password: string
}

interface Response {
  data?: { token: string }
  error?: string
}

const INVALID_ERROR_MESSAGE = 'Invalid username or password'
const GET_USER_QUERY = `
  query GetUser($email: String!) {
    user: User(email: $email) {
      id,
      password
    }
  }
`

export default async (event: FunctionEvent<EventData>): Promise<Response> => {
  try {
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')
    const { email, password } = event.data

    const user = await getUser(api, email)
    if (!user) return { error: INVALID_ERROR_MESSAGE }

    const valid = await passwordMatches(user.password, password)
    if (!valid) return { error: INVALID_ERROR_MESSAGE }

    const token = await graphcool.generateAuthToken(user.id, 'User')
    return { data: { token } }
  } catch (e) {
    console.error(e)
    return { error: 'There was an unexpected error' }
  }
}

async function getUser (api: GraphQLClient, email: string): Promise<User> {
  const response = await api.request<{ user: User }>(GET_USER_QUERY, { email })
  return response.user
}

async function passwordMatches (passwordHash: string, password: string): Promise<boolean> {
  return await bcrypt.compare(password, passwordHash)
}
