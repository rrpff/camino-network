import * as React from 'react'
import styled from 'react-emotion'

const Red = styled.div`
  color: red;
`

export default class App extends React.Component<{}> {
  render () {
    return (
      <Red>
        hello world!
      </Red>
    )
  }
}
