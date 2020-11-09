import React from 'react'
import ReactDOM from 'react-dom'
import reportWebVitals from './reportWebVitals'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { Create, Edit, List, Preview } from './routes/product'

ReactDOM.render(
  <React.StrictMode>
    <Router>
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
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
