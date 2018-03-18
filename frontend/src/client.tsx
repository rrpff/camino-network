import * as React from 'react'
import { hydrate } from 'react-dom'
import styled from 'react-emotion'

const Blue = styled.div`
  color: blue;
`

hydrate(
  <Blue>hello world!</Blue>,
  document.getElementById('root')
)
