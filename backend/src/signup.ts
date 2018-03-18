import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'
import { isEmail } from 'validator'
import * as bcrypt from 'bcryptjs'

interface User {
  readonly id: string
}

interface EventData {
  readonly email: string
  readonly password: string,
  readonly name: string
}

interface Response {
  readonly data?: { id: string, token: string }
  readonly error?: string
}

const USER_EXISTS_QUERY = `
  query UserExists($email: String!) {
    user: User(email: $email) {
      id
    }
  }
`

const CREATE_USER_MUTATION = `
  mutation CreateUser($email: String!, $password: String!, $name: String!) {
    user: createUser(email: $email, password: $password, name: $name) {
      id
    }
  }
`

export default async (event: FunctionEvent<EventData>): Promise<Response> => {
  try {
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')

    const { email, password, name } = event.data

    if (!isEmail(email))
      return { error: 'Not a valid email' }

    if (await userExists(api, email))
      return { error: 'That email address is already used' }

    const hashedPassword = await hashPassword(password)
    const userId = await createUser(api, email, hashedPassword, name)
    const token = await graphcool.generateNodeToken(userId, 'User')

    return { data: { id: userId, token } }
  } catch (e) {
    console.error(e)

    return { error: 'There was an unexpected error' }
  }
}

async function userExists (api: GraphQLClient, email: string): Promise<boolean> {
  const response = await api.request<{ user: User }>(USER_EXISTS_QUERY, { email })
  return response.user !== null
}

async function createUser (api: GraphQLClient, email: string, password: string, name: string,): Promise<string> {
  const response = await api.request<{ user: User }>(CREATE_USER_MUTATION, { email, password, name })
  return response.user.id
}

async function hashPassword (password: string): Promise<string> {
  const SALT_ROUNDS = 10
  const salt = bcrypt.genSaltSync(SALT_ROUNDS)
  return await bcrypt.hash(password, salt)
}
