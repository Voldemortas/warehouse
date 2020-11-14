import React, { useState, useEffect, StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Create, Edit, List, Preview } from './routes/product'
import 'semantic-ui-css/semantic.min.css'
import './style.scss'

const ReactApp = () => {
  const [state, setState] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })
  const addState = () => {
    setState({ width: window.innerWidth, height: window.innerHeight })
  }
  useEffect(() => {
    addState()
  }, [state.width, state.height])
  useEffect(() => {
    window.addEventListener('resize', addState)
    return () => {
      window.removeEventListener('resize', addState)
    }
  }, [])
  return (
    <StrictMode>
      <BrowserRouter>
        <Switch>
          <Route path="/products/create">
            <Create />
          </Route>
          <Route path="/products/:id/edit">
            <Edit />
          </Route>
          <Route path="/products/:id">
            <Preview />
          </Route>
          <Route path="/products">
            <List />
          </Route>
          <Route exact path="/">
            <Redirect to="/products" />
          </Route>
          <Route path="*">
            <>404</>
          </Route>
        </Switch>
      </BrowserRouter>
    </StrictMode>
  )
}

ReactDOM.render(<ReactApp />, document.getElementById('root'))
